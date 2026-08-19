import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from backend.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_number = Column(String(64), unique=True, index=True, nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(32), index=True, nullable=False)
    customer_email = Column(String(255), nullable=True)
    order_type = Column(String(32), default="delivery", nullable=False)  # delivery | takeaway | dine_in
    delivery_address = Column(Text, nullable=True)
    table_number = Column(String(32), nullable=True)
    special_instructions = Column(Text, nullable=True)

    # Financials
    subtotal = Column(Float, default=0.0, nullable=False)
    tax_amount = Column(Float, default=0.0, nullable=False)
    delivery_fee = Column(Float, default=0.0, nullable=False)
    packaging_fee = Column(Float, default=0.0, nullable=False)
    total_amount = Column(Float, default=0.0, nullable=False)

    # Status & Payment
    status = Column(String(32), default="PENDING", nullable=False)  # PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, COMPLETED, CANCELLED
    payment_method = Column(String(32), default="cod", nullable=False)  # cod, upi_on_delivery, cash, online

    # Integrations
    whatsapp_message = Column(Text, nullable=True)
    whatsapp_link = Column(Text, nullable=True)
    google_sheets_synced = Column(Boolean, default=False, nullable=False)
    google_sheets_synced_at = Column(DateTime, nullable=True)
    google_sheets_row = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(Integer, nullable=True)
    item_name = Column(String(255), nullable=False)
    item_type = Column(String(32), default="veg", nullable=False)  # veg | non-veg
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(64), nullable=True)
    email = Column(String(255), nullable=True)
    subject = Column(String(255), default="General Enquiry", nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(32), default="NEW", nullable=False)  # NEW, CONTACTED, RESOLVED
    whatsapp_message = Column(Text, nullable=True)
    whatsapp_link = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id = Column(String(64), primary_key=True)  # starters, main-veg, main-nonveg, breads, rice, desserts, drinks
    label = Column(String(255), nullable=False)
    icon = Column(String(32), default="🍽️", nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

    items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan", order_by="MenuItem.id")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(String(64), ForeignKey("menu_categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    desc = Column(Text, nullable=True)
    price = Column(String(32), nullable=False)  # "₹220"
    price_num = Column(Float, nullable=False)    # 220.0
    type = Column(String(32), default="veg", nullable=False)  # veg | non-veg
    popular = Column(Boolean, default=False, nullable=False)
    spicy = Column(Boolean, default=False, nullable=False)
    available = Column(Boolean, default=True, nullable=False)
    image_url = Column(Text, nullable=True)

    category = relationship("MenuCategory", back_populates="items")


class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    entity_type = Column(String(32), nullable=False)  # order | enquiry
    entity_id = Column(Integer, nullable=False)
    target = Column(String(64), default="google_sheets", nullable=False)
    status = Column(String(32), default="PENDING", nullable=False)  # SUCCESS | FAILED | PENDING
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
