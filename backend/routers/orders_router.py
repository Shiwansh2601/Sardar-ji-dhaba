import uuid
import datetime
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, status
from sqlalchemy.orm import Session, joinedload
from backend.database import get_db, SessionLocal
from backend.config import settings
from backend.models import Order, OrderItem
from backend.schemas import OrderCreate, OrderResponse
from backend.services.whatsapp_service import WhatsAppService
from backend.services.google_sheets_service import GoogleSheetsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def _background_sheets_sync(order_id: int):
    """Background task to sync order to Google Sheets asynchronously without blocking customer response."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
            GoogleSheetsService.sync_order(db, order, items)
    except Exception as e:
        logger.warning(f"Background Google Sheets sync failed: {e}")
    finally:
        db.close()


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Places a new customer order:
    1. Validates items and calculates totals, GST, delivery fee, and packaging fee.
    2. Persists order in primary database (MySQL).
    3. Generates structured WhatsApp message & direct deep-link.
    4. Queues background live synchronization to Google Sheets.
    """
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item.")

    # Calculate itemized totals
    subtotal = 0.0
    order_items_data = []

    for item in payload.items:
        item_subtotal = item.price * item.quantity
        subtotal += item_subtotal
        order_items_data.append(
            OrderItem(
                menu_item_id=item.menu_item_id,
                item_name=item.item_name,
                item_type=item.item_type,
                price=item.price,
                quantity=item.quantity,
                subtotal=item_subtotal,
            )
        )

    # Taxes and fees
    tax_amount = round(subtotal * settings.TAX_RATE, 2)
    delivery_fee = 0.0
    packaging_fee = 0.0

    if payload.order_type == "delivery":
        if subtotal < settings.FREE_DELIVERY_THRESHOLD:
            delivery_fee = settings.DELIVERY_FEE
        packaging_fee = settings.PACKAGING_FEE
    elif payload.order_type == "takeaway":
        packaging_fee = settings.PACKAGING_FEE

    total_amount = round(subtotal + tax_amount + delivery_fee + packaging_fee, 2)

    # Generate unique human-readable Order Number
    now = datetime.datetime.now(datetime.timezone.utc)
    date_part = now.strftime("%Y%m%d")
    unique_suffix = uuid.uuid4().hex[:4].upper()
    order_number = f"SJD-{date_part}-{unique_suffix}"

    new_order = Order(
        order_number=order_number,
        customer_name=payload.customer_name.strip(),
        customer_phone=payload.customer_phone.strip(),
        customer_email=payload.customer_email.strip() if payload.customer_email else None,
        order_type=payload.order_type,
        delivery_address=payload.delivery_address.strip() if payload.delivery_address else None,
        table_number=payload.table_number.strip() if payload.table_number else None,
        special_instructions=payload.special_instructions.strip() if payload.special_instructions else None,
        subtotal=subtotal,
        tax_amount=tax_amount,
        delivery_fee=delivery_fee,
        packaging_fee=packaging_fee,
        total_amount=total_amount,
        status="PENDING",
        payment_method=payload.payment_method,
        items=order_items_data,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Generate structured WhatsApp message & link
    wa_message = WhatsAppService.generate_order_message(new_order, new_order.items)
    wa_link = WhatsAppService.generate_order_whatsapp_link(new_order, new_order.items)

    new_order.whatsapp_message = wa_message
    new_order.whatsapp_link = wa_link
    db.commit()
    db.refresh(new_order)

    # Queue Google Sheets sync in background task (fast, non-blocking)
    if settings.GOOGLE_SHEETS_ENABLED:
        background_tasks.add_task(_background_sheets_sync, new_order.id)

    return new_order


@router.get("/track", response_model=List[OrderResponse])
def track_orders(
    query: str = Query(..., min_length=3, description="Order number or customer phone number"),
    db: Session = Depends(get_db),
):
    """Searches and tracks orders by order number or phone number."""
    term = query.strip()
    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(
            (Order.order_number.ilike(f"%{term}%"))
            | (Order.customer_phone.ilike(f"%{term}%"))
        )
        .order_by(Order.created_at.desc())
        .limit(10)
        .all()
    )
    return orders


@router.get("/{order_identifier}", response_model=OrderResponse)
def get_order_by_identifier(
    order_identifier: str,
    db: Session = Depends(get_db),
):
    """Fetches details of a specific order by Order Number (or ID)."""
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(
            (Order.order_number == order_identifier)
            | (Order.order_number == order_identifier.upper())
        )
        .first()
    )

    if not order and order_identifier.isdigit():
        order = (
            db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.id == int(order_identifier))
            .first()
        )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    return order
