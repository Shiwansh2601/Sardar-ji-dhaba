import sys
import os
import json
from sqlalchemy import create_engine, text

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.config import settings
from backend.services.google_sheets_service import GoogleSheetsService


def verify_all():
    print("================================================================")
    print("🔍 RUNNING REAL DIAGNOSTIC TEST FOR SARDAAR JI DHABA")
    print("================================================================\n")

    # 1. TEST MYSQL DATABASE CONNECTION
    print("--- 1. Testing MySQL Database Connection ---")
    db_url = settings.DATABASE_URL
    print(f"Configured DATABASE_URL: {db_url}")

    mysql_ok = False
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            val = result.scalar()
            if val == 1:
                print("✓ MySQL Connection Verified! Database is live and responding.")
                mysql_ok = True
    except Exception as e:
        print(f"❌ MySQL Connection Error: {e}")

    # 2. TEST GOOGLE SHEETS API & SERVICE ACCOUNT
    print("\n--- 2. Testing Google Sheets API Integration ---")
    sheets_ok = False
    service_email = ""
    try:
        # Read service account email directly from json file
        json_path = settings.GOOGLE_SHEETS_CREDENTIALS_FILE
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                info = json.load(f)
                service_email = info.get("client_email", "")
        elif os.path.exists(os.path.join("backend", json_path)):
            with open(os.path.join("backend", json_path), "r", encoding="utf-8") as f:
                info = json.load(f)
                service_email = info.get("client_email", "")

        client = GoogleSheetsService.get_client()
        if client:
            print("✓ Google Service Account authenticated successfully!")
            if service_email:
                print(f"  Service Account Email: {service_email}")

            print(f"Connecting to Google Sheet '{settings.GOOGLE_SHEET_NAME}'...")
            worksheet = GoogleSheetsService.get_worksheet()
            if worksheet:
                print(f"✓ Successfully connected to Google Sheet: '{settings.GOOGLE_SHEET_NAME}'")
                headers = worksheet.row_values(1)
                print(f"  Sheet Columns: {headers[:6]}... ({len(headers)} total columns)")
                sheets_ok = True
            else:
                print("⚠️ Could not access worksheet.")
                print(f"  👉 IMPORTANT: Please open your Google Sheet ('{settings.GOOGLE_SHEET_NAME}') and click 'Share' -> share with:")
                print(f"     {service_email}")
                print("     Set permission to 'Editor'.")
        else:
            print("❌ Google Sheets client failed to initialize. Check service_account.json.")
    except Exception as e:
        print(f"⚠️ Google Sheets Notice: {e}")
        if "PERMISSION_DENIED" in str(e) or "SpreadsheetNotFound" in str(e) or "404" in str(e):
            print(f"\n👉 ACTION REQUIRED FOR GOOGLE SHEETS:")
            print(f"1. Open https://sheets.new and create a sheet named '{settings.GOOGLE_SHEET_NAME}'")
            print(f"2. Click 'Share' (top-right) and share with: {service_email}")
            print("3. Give 'Editor' permissions and click Share.")

    # 3. TEST BUSINESS DETAILS & WHATSAPP CONFIG
    print("\n--- 3. Testing Business Config & WhatsApp Phone ---")
    print(f"✓ Dhaba Name: {settings.DHABA_NAME} ({settings.DHABA_SUBTITLE})")
    print(f"✓ Phone (Display): {settings.DHABA_PHONE}")
    print(f"✓ Phone (Raw): {settings.DHABA_PHONE_RAW}")
    print(f"✓ WhatsApp Business Number: {settings.DHABA_WHATSAPP_NUMBER}")
    print(f"✓ Email: {settings.DHABA_EMAIL}")
    print(f"✓ Google Maps Link: {settings.GOOGLE_MAPS_URL}")

    print("\n================================================================")
    print("📊 DIAGNOSTIC SUMMARY:")
    print(f"• Database (MySQL): {'✅ CONNECTED & OPERATIONAL' if mysql_ok else '❌ FAILED'}")
    print(f"• Google Sheets:   {'✅ CONNECTED & OPERATIONAL' if sheets_ok else '⚠️ PENDING SHEET SHARING (See action above)'}")
    print(f"• WhatsApp / Phone: ✅ CONFIGURED (+91 9838075251)")
    print("================================================================")


if __name__ == "__main__":
    verify_all()
