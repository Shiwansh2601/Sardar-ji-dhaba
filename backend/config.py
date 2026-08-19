import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Sardaar Ji Dhaba API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security & CORS
    SECRET_KEY: str = "sardaar_ji_dhaba_secret_key_2026_change_in_prod"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

    # Database Configuration (MySQL / SQLite fallback for smooth portability)
    # MySQL Example: mysql+pymysql://username:password@localhost:3306/sardaarji_dhaba
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dhaba.db")

    # Business Information (Configurable via ENV)
    DHABA_NAME: str = "Sardaar Ji Dhaba"
    DHABA_SUBTITLE: str = "Prayagraj"
    DHABA_PHONE: str = "+91 8882897431"
    DHABA_PHONE_RAW: str = "918882897431"
    DHABA_WHATSAPP_NUMBER: str = "918882897431"
    DHABA_EMAIL: str = "sardaarjidhaba@gmail.com"
    DHABA_ADDRESS: str = "138C, Mahatma Gandhi Marg, near El Chico, Civil Lines, Prayagraj, Uttar Pradesh 211001"
    GOOGLE_MAPS_URL: str = "https://www.google.com/maps/place/?q=place_id:ChIJkQUGosDLmjkRF-KEtY-5EvA"
    GOOGLE_MAPS_EMBED_URL: str = "https://maps.google.com/maps?q=Sardaar+Ji+Dhaba+Prayagraj&output=embed"
    INSTAGRAM_URL: str = "https://www.instagram.com/sardaarjidhaba/"
    FACEBOOK_URL: str = "https://www.facebook.com/sardaarjidhaba/"
    YOUTUBE_URL: str = "https://www.youtube.com/@sardaarjidhaba"
    BUSINESS_HOURS_DISPLAY: str = "8:00 AM – 11:00 PM, All Days"
    BUSINESS_HOURS_START: str = "08:00"
    BUSINESS_HOURS_END: str = "23:00"
    RATING: float = 4.3
    REVIEWS_COUNT: str = "1,093+"
    SINCE: str = "Est. 2008"

    # Pricing & Taxes
    TAX_RATE: float = 0.05  # 5% GST
    DELIVERY_FEE: float = 30.0  # ₹30 standard delivery fee
    FREE_DELIVERY_THRESHOLD: float = 500.0  # Free delivery above ₹500
    PACKAGING_FEE: float = 15.0  # ₹15 packaging charge

    # Google Sheets Live Integration
    GOOGLE_SHEETS_ENABLED: bool = True
    GOOGLE_SHEETS_CREDENTIALS_FILE: str = "service_account.json"
    GOOGLE_SERVICE_ACCOUNT_JSON: Optional[str] = None  # Inline JSON string for serverless/cloud environments
    GOOGLE_SHEET_ID: Optional[str] = None  # Specific Spreadsheet ID (if empty, searches or creates by name)
    GOOGLE_SHEET_NAME: str = "Sardaar Ji Dhaba - Live Orders"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
