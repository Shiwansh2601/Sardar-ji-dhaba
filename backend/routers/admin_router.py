from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from backend.database import get_db
from backend.models import Order, OrderItem
from backend.schemas import OrderResponse, OrderStatusUpdate, SyncRetryResponse
from backend.services.google_sheets_service import GoogleSheetsService
from backend.config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin & Operations"])


@router.get("/orders", response_model=List[OrderResponse])
def list_all_orders(
    status: Optional[str] = Query(None, description="Filter by status (PENDING, CONFIRMED, PREPARING, etc.)"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Lists recent orders for dhaba management & kitchen view."""
    q = db.query(Order).options(joinedload(Order.items))
    if status:
        q = q.filter(Order.status == status.upper())
    return q.order_by(Order.created_at.desc()).limit(limit).all()


@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    """Updates order status and mirrors change live to Google Sheets."""
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    valid_statuses = [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
        "COMPLETED",
        "CANCELLED",
    ]

    new_status = payload.status.upper()
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Must be one of: {', '.join(valid_statuses)}",
        )

    order.status = new_status
    db.commit()
    db.refresh(order)

    # Sync status change to Google Sheets
    GoogleSheetsService.update_order_status(db, order)

    return order


@router.post("/sync-retry", response_model=SyncRetryResponse)
def retry_failed_google_sheets_sync(db: Session = Depends(get_db)):
    """Retries syncing all un-synced orders from MySQL to Google Sheets."""
    success, failed, details = GoogleSheetsService.retry_pending_syncs(db)
    return SyncRetryResponse(
        total_orders_retried=success + failed,
        successful_syncs=success,
        failed_syncs=failed,
        details=details,
    )


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Operational health check verifying database and Google Sheets client connectivity."""
    db_ok = True
    db_error = None
    try:
        db.execute("SELECT 1")
    except Exception as e:
        # For SQLAlchemy 2.0 raw text
        from sqlalchemy import text
        try:
            db.execute(text("SELECT 1"))
        except Exception as e2:
            db_ok = False
            db_error = str(e2)

    sheets_client = GoogleSheetsService.get_client()
    sheets_ok = sheets_client is not None

    return {
        "status": "healthy" if db_ok else "degraded",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "database": {
            "status": "connected" if db_ok else "disconnected",
            "type": "mysql" if "mysql" in settings.DATABASE_URL else "sqlite",
            "error": db_error,
        },
        "google_sheets": {
            "enabled": settings.GOOGLE_SHEETS_ENABLED,
            "connected": sheets_ok,
            "sheet_name": settings.GOOGLE_SHEET_NAME,
        },
    }
