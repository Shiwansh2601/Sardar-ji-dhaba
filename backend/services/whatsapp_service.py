import urllib.parse
from typing import List
from backend.config import settings
from backend.models import Order, OrderItem, Enquiry


class WhatsAppService:
    @staticmethod
    def generate_order_message(order: Order, items: List[OrderItem]) -> str:
        """Generates a structured, clean WhatsApp message for an order."""
        dhaba_name = settings.DHABA_NAME
        type_str = order.order_type.replace("_", " ").title()

        lines = [
            f"🍛 *NEW ORDER - {dhaba_name.upper()}*",
            f"━━━━━━━━━━━━━━━━━━━━━━",
            f"📋 *Order ID:* `{order.order_number}`",
            f"👤 *Customer:* {order.customer_name}",
            f"📞 *Phone:* {order.customer_phone}",
            f"🏷️ *Type:* {type_str}",
        ]

        if order.customer_email:
            lines.append(f"📧 *Email:* {order.customer_email}")

        if order.order_type == "delivery" and order.delivery_address:
            lines.append(f"📍 *Delivery Address:* {order.delivery_address}")
        elif order.order_type == "dine_in" and order.table_number:
            lines.append(f"🪑 *Table No:* {order.table_number}")

        if order.special_instructions:
            lines.append(f"📝 *Notes:* {order.special_instructions}")

        lines.append(f"━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"🍽️ *ITEMS ORDERED:*")

        for item in items:
            type_icon = "🌿" if item.item_type == "veg" else "🍗"
            lines.append(f"  {type_icon} *{item.item_name}*")
            lines.append(f"     ↳ {item.quantity} × ₹{item.price:.0f} = *₹{item.subtotal:.0f}*")

        lines.append(f"━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"💵 *Subtotal:* ₹{order.subtotal:.0f}")

        if order.tax_amount > 0:
            lines.append(f"📊 *GST (5%):* ₹{order.tax_amount:.0f}")

        if order.delivery_fee > 0:
            lines.append(f"🛵 *Delivery Fee:* ₹{order.delivery_fee:.0f}")
        elif order.order_type == "delivery":
            lines.append(f"🛵 *Delivery Fee:* Free (Order > ₹{settings.FREE_DELIVERY_THRESHOLD:.0f})")

        if order.packaging_fee > 0:
            lines.append(f"📦 *Packaging:* ₹{order.packaging_fee:.0f}")

        lines.append(f"💰 *FINAL TOTAL:* *₹{order.total_amount:.0f}*")
        lines.append(f"💳 *Payment Method:* {order.payment_method.upper()}")
        lines.append(f"━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"Please confirm this order and estimated preparation time. Thank you!")

        return "\n".join(lines)

    @staticmethod
    def generate_order_whatsapp_link(order: Order, items: List[OrderItem]) -> str:
        """Generates a clickable wa.me direct link."""
        message = WhatsAppService.generate_order_message(order, items)
        encoded_message = urllib.parse.quote(message)
        whatsapp_number = settings.DHABA_WHATSAPP_NUMBER
        return f"https://wa.me/{whatsapp_number}?text={encoded_message}"

    @staticmethod
    def generate_enquiry_message(enquiry: Enquiry) -> str:
        """Generates a structured message for general enquiries."""
        lines = [
            f"👋 *ENQUIRY - {settings.DHABA_NAME.upper()}*",
            f"━━━━━━━━━━━━━━━━━━━━━━",
            f"👤 *Name:* {enquiry.name}",
        ]
        if enquiry.phone:
            lines.append(f"📞 *Phone:* {enquiry.phone}")
        if enquiry.email:
            lines.append(f"📧 *Email:* {enquiry.email}")
        lines.append(f"📌 *Subject:* {enquiry.subject}")
        lines.append(f"━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"💬 *Message:*\n{enquiry.message}")
        lines.append(f"━━━━━━━━━━━━━━━━━━━━━━")
        lines.append(f"Sent via Sardaar Ji Dhaba Website")
        return "\n".join(lines)

    @staticmethod
    def generate_enquiry_whatsapp_link(enquiry: Enquiry) -> str:
        """Generates a clickable wa.me link for enquiries."""
        message = WhatsAppService.generate_enquiry_message(enquiry)
        encoded = urllib.parse.quote(message)
        return f"https://wa.me/{settings.DHABA_WHATSAPP_NUMBER}?text={encoded}"
