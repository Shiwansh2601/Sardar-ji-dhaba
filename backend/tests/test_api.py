import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.database import Base, get_db
from backend.services.seed_data import seed_menu_data
from backend.services.whatsapp_service import WhatsAppService
from backend.models import Order, OrderItem

# Use in-memory SQLite with StaticPool so all connections share the same in-memory DB
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    from backend.config import settings
    settings.GOOGLE_SHEETS_ENABLED = False
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_menu_data(db)
    yield
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Sardaar Ji Dhaba" in data["message"]


def test_health_check(client):
    response = client.get("/api/admin/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"]["status"] == "connected"


def test_get_business_config(client):
    response = client.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Sardaar Ji Dhaba"
    assert len(data["phone_raw"]) >= 10
    assert "https://wa.me/" in data["whatsapp_url"]
    assert data["tax_rate"] == 0.05
    assert data["delivery_fee"] == 30.0


def test_get_menu_categories(client):
    response = client.get("/api/menu/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 6
    cat_ids = [c["id"] for c in categories]
    assert "starters" in cat_ids
    assert "main-veg" in cat_ids
    assert "breads" in cat_ids


def test_get_menu_items_with_filters(client):
    # Test all items
    response = client.get("/api/menu/items")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0

    # Test filter by category
    response_starters = client.get("/api/menu/items?category_id=starters")
    assert response_starters.status_code == 200
    starters = response_starters.json()
    assert all(i["category_id"] == "starters" for i in starters)

    # Test search query
    response_search = client.get("/api/menu/items?query=paneer")
    assert response_search.status_code == 200
    paneer_items = response_search.json()
    assert len(paneer_items) > 0
    assert any("paneer" in i["name"].lower() for i in paneer_items)


def test_submit_enquiry(client):
    payload = {
        "name": "Manish Kumar",
        "phone": "+91 9876543210",
        "email": "manish@example.com",
        "subject": "Table Reservation",
        "message": "We would like to reserve a table for 6 people this Sunday at 8 PM.",
    }
    response = client.post("/api/enquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["name"] == "Manish Kumar"
    assert data["status"] == "NEW"
    assert "wa.me" in data["whatsapp_link"]


def test_create_and_track_order(client):
    order_payload = {
        "customer_name": "Rohan Gupta",
        "customer_phone": "9876543210",
        "customer_email": "rohan@example.com",
        "order_type": "delivery",
        "delivery_address": "Flat 402, Civil Lines Apartments, Prayagraj",
        "special_instructions": "Please make the Butter Chicken medium spicy and provide extra onions.",
        "payment_method": "cod",
        "items": [
            {
                "menu_item_id": 201,
                "item_name": "Dal Makhani",
                "item_type": "veg",
                "price": 180.0,
                "quantity": 2,
            },
            {
                "menu_item_id": 402,
                "item_name": "Butter Naan",
                "item_type": "veg",
                "price": 45.0,
                "quantity": 4,
            },
        ],
    }

    response = client.post("/api/orders", json=order_payload)
    assert response.status_code == 201
    order = response.json()

    # Verify Calculations
    # Subtotal: (180 * 2) + (45 * 4) = 360 + 180 = 540
    # Tax: 540 * 0.05 = 27.0
    # Delivery Fee: 0 (subtotal >= 500 threshold)
    # Packaging Fee: 15.0
    # Total: 540 + 27 + 0 + 15 = 582.0
    assert order["subtotal"] == 540.0
    assert order["tax_amount"] == 27.0
    assert order["delivery_fee"] == 0.0
    assert order["packaging_fee"] == 15.0
    assert order["total_amount"] == 582.0
    assert order["order_number"].startswith("SJD-")
    assert order["status"] == "PENDING"
    assert "https://wa.me/" in order["whatsapp_link"]
    assert "Dal Makhani" in order["whatsapp_message"]

    # Test Track Order by Order Number
    track_res = client.get(f"/api/orders/{order['order_number']}")
    assert track_res.status_code == 200
    assert track_res.json()["order_number"] == order["order_number"]

    # Test Search Order by Phone
    search_res = client.get("/api/orders/track?query=9876543210")
    assert search_res.status_code == 200
    results = search_res.json()
    assert len(results) >= 1
    assert results[0]["order_number"] == order["order_number"]

    # Test Admin Status Update
    order_id = order["id"]
    status_res = client.patch(
        f"/api/admin/orders/{order_id}/status",
        json={"status": "CONFIRMED"},
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "CONFIRMED"


def test_whatsapp_message_formatting():
    order = Order(
        id=1,
        order_number="SJD-20260819-A1B2",
        customer_name="Simran Kaur",
        customer_phone="9876543210",
        order_type="delivery",
        delivery_address="12 MG Marg, Civil Lines",
        subtotal=400.0,
        tax_amount=20.0,
        delivery_fee=30.0,
        packaging_fee=15.0,
        total_amount=465.0,
        payment_method="cod",
    )
    items = [
        OrderItem(
            order_id=1,
            item_name="Paneer Butter Masala",
            item_type="veg",
            price=240.0,
            quantity=1,
            subtotal=240.0,
        ),
        OrderItem(
            order_id=1,
            item_name="Dal Makhani",
            item_type="veg",
            price=160.0,
            quantity=1,
            subtotal=160.0,
        ),
    ]

    msg = WhatsAppService.generate_order_message(order, items)
    assert "SJD-20260819-A1B2" in msg
    assert "Simran Kaur" in msg
    assert "Paneer Butter Masala" in msg
    assert "₹465" in msg
    assert "12 MG Marg" in msg
