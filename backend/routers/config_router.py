from fastapi import APIRouter
from backend.config import settings
from backend.schemas import BusinessConfigResponse

router = APIRouter(prefix="/api/config", tags=["Configuration"])


@router.get("", response_model=BusinessConfigResponse)
def get_business_config():
    """Returns public business configuration for the frontend."""
    whatsapp_url = f"https://wa.me/{settings.DHABA_WHATSAPP_NUMBER}?text=Hi!%20I%20would%20like%20to%20place%20an%20order%20from%20Sardaar%20Ji%20Dhaba."

    return BusinessConfigResponse(
        name=settings.DHABA_NAME,
        subtitle=settings.DHABA_SUBTITLE,
        phone=settings.DHABA_PHONE,
        phone_raw=settings.DHABA_PHONE_RAW,
        whatsapp_number=settings.DHABA_WHATSAPP_NUMBER,
        whatsapp_url=whatsapp_url,
        email=settings.DHABA_EMAIL,
        address=settings.DHABA_ADDRESS,
        map_url=settings.GOOGLE_MAPS_URL,
        map_embed_url=settings.GOOGLE_MAPS_EMBED_URL,
        instagram=settings.INSTAGRAM_URL,
        facebook=settings.FACEBOOK_URL,
        youtube=settings.YOUTUBE_URL,
        hours_display=settings.BUSINESS_HOURS_DISPLAY,
        rating=settings.RATING,
        reviews_count=settings.REVIEWS_COUNT,
        since=settings.SINCE,
        tax_rate=settings.TAX_RATE,
        delivery_fee=settings.DELIVERY_FEE,
        free_delivery_threshold=settings.FREE_DELIVERY_THRESHOLD,
        packaging_fee=settings.PACKAGING_FEE,
    )
