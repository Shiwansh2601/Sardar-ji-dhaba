import sys
import httpx
import json

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://127.0.0.1:5173"


def test_live_system():
    print("--- 1. Testing Backend Root & Health ---")
    res = httpx.get(f"{BACKEND_URL}/")
    print(f"Root: {res.status_code} -> {res.json()}")
    assert res.status_code == 200

    res = httpx.get(f"{BACKEND_URL}/api/admin/health")
    print(f"Health: {res.status_code} -> {res.json()}")
    assert res.status_code == 200

    print("\n--- 2. Testing Public Business Config Endpoint ---")
    res = httpx.get(f"{BACKEND_URL}/api/config")
    config = res.json()
    print(f"Config for {config['name']} ({config['subtitle']}): Phone={config['phone']}, WhatsApp={config['whatsapp_number']}")
    assert config["name"] == "Sardaar Ji Dhaba"

    print("\n--- 3. Testing Dynamic Menu Categories & Items ---")
    res = httpx.get(f"{BACKEND_URL}/api/menu/categories")
    categories = res.json()
    print(f"Found {len(categories)} categories in database:")
    for cat in categories:
        print(f"  {cat['icon']} {cat['label']} ({len(cat['items'])} dishes)")
    assert len(categories) >= 6

    print("\n--- 4. Testing Placing a Real Order ---")
    order_payload = {
        "customer_name": "Arjun Kapoor",
        "customer_phone": "9876543210",
        "customer_email": "arjun@example.com",
        "order_type": "delivery",
        "delivery_address": "House 14, Civil Lines, Near High Court, Prayagraj",
        "special_instructions": "Please make the Paneer Tikka extra charred and pack mint chutney separately.",
        "payment_method": "cod",
        "items": [
            {
                "menu_item_id": 101,
                "item_name": "Paneer Tikka",
                "item_type": "veg",
                "price": 220.0,
                "quantity": 2,
            },
            {
                "menu_item_id": 201,
                "item_name": "Dal Makhani",
                "item_type": "veg",
                "price": 180.0,
                "quantity": 1,
            },
            {
                "menu_item_id": 402,
                "item_name": "Butter Naan",
                "item_type": "veg",
                "price": 45.0,
                "quantity": 3,
            },
        ],
    }
    # Subtotal: (220*2) + (180*1) + (45*3) = 440 + 180 + 135 = 755
    # GST (5%): 37.75
    # Delivery: Free (subtotal >= 500)
    # Packaging: 15
    res = httpx.post(f"{BACKEND_URL}/api/orders", json=order_payload)
    print(f"Order Creation Status: {res.status_code}")
    order_data = res.json()
    order_num = order_data["order_number"]
    print(f"Assigned Order ID: {order_num}")
    print(f"Order Subtotal: ₹{order_data['subtotal']}")
    print(f"Order Tax: ₹{order_data['tax_amount']}")
    print(f"Delivery Fee: ₹{order_data['delivery_fee']}")
    print(f"Total Amount: ₹{order_data['total_amount']}")
    print(f"\nGenerated WhatsApp Link:\n{order_data['whatsapp_link']}")
    print(f"\nStructured WhatsApp Message Content:\n{order_data['whatsapp_message']}")
    assert res.status_code == 201
    assert order_data["subtotal"] == 755.0

    print("\n--- 5. Testing Live Order Tracking by Order ID & Phone ---")
    track_id_res = httpx.get(f"{BACKEND_URL}/api/orders/{order_num}")
    assert track_id_res.status_code == 200
    print(f"Lookup by ID '{order_num}': Status = {track_id_res.json()['status']}")

    track_phone_res = httpx.get(f"{BACKEND_URL}/api/orders/track?query=9876543210")
    assert track_phone_res.status_code == 200
    print(f"Lookup by Phone '9876543210': Found {len(track_phone_res.json())} order(s)")

    print("\n--- 6. Testing Enquiry Submission & WhatsApp Generation ---")
    enquiry_payload = {
        "name": "Kavita Sharma",
        "phone": "+91 9123456789",
        "email": "kavita@example.com",
        "subject": "Bulk Catering",
        "message": "We would like to arrange catering for a birthday party of 40 guests next Saturday.",
    }
    enq_res = httpx.post(f"{BACKEND_URL}/api/enquiries", json=enquiry_payload)
    print(f"Enquiry Status: {enq_res.status_code} -> ID #{enq_res.json()['id']}")
    print(f"Enquiry WhatsApp Link: {enq_res.json()['whatsapp_link']}")
    assert enq_res.status_code == 201

    print("\n--- 7. Testing Frontend Dev Server ---")
    fe_res = httpx.get(f"{FRONTEND_URL}/")
    print(f"Frontend Response Status: {fe_res.status_code}")
    assert fe_res.status_code == 200
    assert "Sardaar Ji Dhaba" in fe_res.text or "<div id=\"root\">" in fe_res.text

    print("\n=======================================================")
    print("ALL LIVE END-TO-END VERIFICATION CHECKS PASSED!")
    print("=======================================================")


if __name__ == "__main__":
    test_live_system()
