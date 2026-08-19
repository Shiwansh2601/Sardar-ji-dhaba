from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict


class BusinessConfigResponse(BaseModel):
    name: str
    subtitle: str
    phone: str
    phone_raw: str
    whatsapp_number: str
    whatsapp_url: str
    email: str
    address: str
    map_url: str
    map_embed_url: str
    instagram: str
    facebook: str
    youtube: str
    hours_display: str
    rating: float
    reviews_count: str
    since: str
    tax_rate: float
    delivery_fee: float
    free_delivery_threshold: float
    packaging_fee: float


class MenuItemResponse(BaseModel):
    id: int
    category_id: str
    name: str
    desc: Optional[str] = None
    price: str
    price_num: float
    type: str  # veg | non-veg
    popular: bool = False
    spicy: bool = False
    available: bool = True
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MenuCategoryResponse(BaseModel):
    id: str
    label: str
    icon: str
    sort_order: int
    items: List[MenuItemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    menu_item_id: Optional[int] = None
    item_name: str = Field(..., min_length=1)
    item_type: str = Field(default="veg")
    price: float = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_phone: str = Field(..., min_length=10, max_length=20)
    customer_email: Optional[str] = None
    order_type: str = Field(default="delivery")  # delivery, takeaway, dine_in
    delivery_address: Optional[str] = None
    table_number: Optional[str] = None
    special_instructions: Optional[str] = None
    payment_method: str = Field(default="cod")  # cod, upi_on_delivery, cash
    items: List[OrderItemCreate] = Field(..., min_length=1)

    @field_validator("customer_phone")
    @classmethod
    def clean_phone(cls, v: str) -> str:
        clean = "".join(filter(str.isdigit, v))
        if len(clean) < 10:
            raise ValueError("Phone number must have at least 10 digits")
        return v.strip()

    @field_validator("order_type")
    @classmethod
    def validate_order_type(cls, v: str) -> str:
        valid_types = ["delivery", "takeaway", "dine_in"]
        if v.lower() not in valid_types:
            raise ValueError(f"Order type must be one of {valid_types}")
        return v.lower()


class OrderItemResponse(BaseModel):
    id: int
    item_name: str
    item_type: str
    price: float
    quantity: int
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    order_type: str
    delivery_address: Optional[str] = None
    table_number: Optional[str] = None
    special_instructions: Optional[str] = None
    subtotal: float
    tax_amount: float
    delivery_fee: float
    packaging_fee: float
    total_amount: float
    status: str
    payment_method: str
    whatsapp_message: Optional[str] = None
    whatsapp_link: Optional[str] = None
    google_sheets_synced: bool
    created_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., min_length=3)


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    email: Optional[str] = None
    subject: str = Field(default="General Enquiry")
    message: str = Field(..., min_length=3, max_length=2000)


class EnquiryResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    subject: str
    message: str
    status: str
    whatsapp_link: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SyncRetryResponse(BaseModel):
    total_orders_retried: int
    successful_syncs: int
    failed_syncs: int
    details: List[str] = []
