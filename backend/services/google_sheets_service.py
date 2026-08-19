import os
import json
import logging
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import Order, OrderItem, SyncLog

logger = logging.getLogger(__name__)

HEADERS = [
    "Timestamp (IST)",
    "Order ID",
    "Customer Name",
    "Phone",
    "Order Type",
    "Items Summary",
    "Subtotal (₹)",
    "Tax (₹)",
    "Delivery Fee (₹)",
    "Total (₹)",
    "Payment Method",
    "Delivery Address",
    "Special Notes",
    "Status",
    "Synced At",
]


class GoogleSheetsService:
    _client = None
    _sheet = None

    @classmethod
    def get_client(cls):
        """Initializes and caches the gspread client using Service Account."""
        if cls._client is not None:
            return cls._client

        if not settings.GOOGLE_SHEETS_ENABLED:
            logger.info("Google Sheets integration is disabled in config.")
            return None

        try:
            import gspread
            from google.oauth2.service_account import Credentials

            scopes = [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive",
            ]

            credentials = None

            # Option 1: Inline JSON string in environment variable
            if settings.GOOGLE_SERVICE_ACCOUNT_JSON:
                try:
                    info = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON)
                    credentials = Credentials.from_service_account_info(info, scopes=scopes)
                except Exception as e:
                    logger.error(f"Error parsing GOOGLE_SERVICE_ACCOUNT_JSON: {e}")

            # Option 2: Credentials JSON file path
            if not credentials and settings.GOOGLE_SHEETS_CREDENTIALS_FILE:
                file_path = settings.GOOGLE_SHEETS_CREDENTIALS_FILE
                if os.path.exists(file_path):
                    credentials = Credentials.from_service_account_file(file_path, scopes=scopes)
                else:
                    # Also check backend/service_account.json
                    backend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), file_path)
                    if os.path.exists(backend_path):
                        credentials = Credentials.from_service_account_file(backend_path, scopes=scopes)

            if not credentials:
                logger.warning(
                    "Google Sheets credentials not found. Orders will be saved to Database and queued for sync once credentials are provided."
                )
                return None

            cls._client = gspread.authorize(credentials)
            return cls._client

        except ImportError:
            logger.error("gspread or google-auth package not installed.")
            return None
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets client: {e}")
            return None

    @classmethod
    def get_worksheet(cls):
        """Gets or creates the active worksheet for live orders."""
        client = cls.get_client()
        if not client:
            return None

        try:
            spreadsheet = None
            if settings.GOOGLE_SHEET_ID:
                spreadsheet = client.open_by_key(settings.GOOGLE_SHEET_ID)
            else:
                try:
                    spreadsheet = client.open(settings.GOOGLE_SHEET_NAME)
                except Exception:
                    # Create if it doesn't exist
                    spreadsheet = client.create(settings.GOOGLE_SHEET_NAME)
                    logger.info(f"Created new Google Sheet: {settings.GOOGLE_SHEET_NAME}")

            worksheet = spreadsheet.sheet1
            # Ensure headers are present
            first_row = worksheet.row_values(1)
            if not first_row or len(first_row) < 5:
                worksheet.insert_row(HEADERS, 1)
                logger.info("Initialized Google Sheet headers.")

            return worksheet
        except Exception as e:
            logger.error(f"Failed to access Google Worksheet: {e}")
            return None

    @classmethod
    def sync_order(cls, db: Session, order: Order, items: List[OrderItem]) -> Tuple[bool, str]:
        """
        Synchronizes a newly placed or updated order to Google Sheets.
        Returns (success: bool, message: str).
        """
        try:
            worksheet = cls.get_worksheet()
            if not worksheet:
                cls._log_sync(db, order.id, "FAILED", "Google Sheets not configured or unreachable")
                return False, "Google Sheets not configured or unreachable"

            items_str = ", ".join([f"{item.item_name} (x{item.quantity})" for item in items])
            timestamp_str = order.created_at.strftime("%Y-%m-%d %H:%M:%S")
            synced_at_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

            row_data = [
                timestamp_str,
                order.order_number,
                order.customer_name,
                order.customer_phone,
                order.order_type.upper(),
                items_str,
                float(order.subtotal),
                float(order.tax_amount),
                float(order.delivery_fee),
                float(order.total_amount),
                order.payment_method.upper(),
                order.delivery_address or (f"Table {order.table_number}" if order.table_number else "N/A"),
                order.special_instructions or "N/A",
                order.status,
                synced_at_str,
            ]

            worksheet.append_row(row_data, value_input_option="USER_ENTERED")

            # Update DB state
            order.google_sheets_synced = True
            order.google_sheets_synced_at = datetime.utcnow()
            db.commit()

            cls._log_sync(db, order.id, "SUCCESS", None)
            logger.info(f"Successfully synced order {order.order_number} to Google Sheets.")
            return True, "Synced successfully"

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Google Sheets sync failed for order {order.order_number}: {error_msg}")
            cls._log_sync(db, order.id, "FAILED", error_msg)
            return False, error_msg

    @classmethod
    def update_order_status(cls, db: Session, order: Order) -> Tuple[bool, str]:
        """Updates the status column for a given order in Google Sheets."""
        try:
            worksheet = cls.get_worksheet()
            if not worksheet:
                return False, "Google Sheets not configured"

            cell = worksheet.find(order.order_number)
            if cell:
                # Column 14 is Status (1-based index)
                worksheet.update_cell(cell.row, 14, order.status)
                logger.info(f"Updated status for order {order.order_number} to {order.status} in Google Sheets.")
                return True, "Status updated in Google Sheets"
            return False, "Order ID cell not found in sheet"
        except Exception as e:
            logger.error(f"Failed to update status in Google Sheet: {e}")
            return False, str(e)

    @classmethod
    def retry_pending_syncs(cls, db: Session) -> Tuple[int, int, List[str]]:
        """Retries syncing all un-synced orders in the database."""
        pending_orders = db.query(Order).filter(Order.google_sheets_synced == False).all()
        success_count = 0
        failed_count = 0
        details = []

        for order in pending_orders:
            items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
            ok, msg = cls.sync_order(db, order, items)
            if ok:
                success_count += 1
                details.append(f"Order {order.order_number}: Synced successfully")
            else:
                failed_count += 1
                details.append(f"Order {order.order_number}: Failed ({msg})")

        return success_count, failed_count, details

    @staticmethod
    def _log_sync(db: Session, order_id: int, status: str, error_message: Optional[str]):
        try:
            log_entry = SyncLog(
                entity_type="order",
                entity_id=order_id,
                target="google_sheets",
                status=status,
                error_message=error_message,
            )
            db.add(log_entry)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to write sync log: {e}")
