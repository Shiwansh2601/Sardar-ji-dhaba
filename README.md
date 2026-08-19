# 🍛 Sardaar Ji Dhaba — Full-Stack Web Platform

> A modern, production-ready full-stack restaurant platform for **Sardaar Ji Dhaba (Prayagraj)**.  
> Built by preserving the Figma-crafted frontend design, animations, and typography, and integrating a high-performance **FastAPI (Python)** backend, **MySQL / SQLAlchemy** database, **WhatsApp Structured Messaging**, and **Google Sheets API Live Operational Syncing**.

---

## 🌟 Key Features

- **🎨 Preserved Figma Visual Identity**: 100% fidelity to the authentic Punjabi aesthetic, typography, brand colors, animations, and full mobile responsiveness.
- **⚡ FastAPI Backend**: High-performance asynchronous Python backend with Pydantic v2 data validation and SQLAlchemy ORM.
- **🗄️ MySQL Database (with SQLite Fallback)**: Persistent, transactional storage for orders, line items, menu categories, dishes, and customer enquiries.
- **📱 WhatsApp Integration**: Automatic generation of rich, formatted WhatsApp order receipts and booking messages with deep-linking (`wa.me`).
- **📊 Google Sheets API Live Syncing**: Real-time operational order tracking mirrored live to Google Sheets with automatic header formatting, status updates, and resilient background retry handling (database is the primary source of truth).
- **🛒 Dynamic Cart & Checkout**:
  - Live subtotal, 5% GST tax calculation, packaging charges, and free delivery thresholds.
  - Delivery, Takeaway, and Dine-in modes.
  - Interactive Order Confirmation with assigned Order Number (`SJD-YYYYMMDD-XXXX`).
- **🔍 Live Order Tracking**: Customers can look up their orders in real-time by Order Number or Phone Number with a visual step-by-step preparation timeline.
- **📝 Contact & Table Booking**: Instant submission with database persistence and direct WhatsApp forwarding.

---

## 🏗️ Architecture

```mermaid
graph TD
    Client[React + Vite Frontend\nFigma Preserved Design] -->|REST APIs| FastAPI[FastAPI Backend\nPython 3.13]
    FastAPI -->|Primary Source of Truth| DB[(MySQL Database\nSQLAlchemy ORM)]
    FastAPI -->|Live Operational Sync| Sheets[Google Sheets API\nOperational Tracking]
    FastAPI -->|Deep Link Generation| WA[WhatsApp Messaging\nwa.me / Direct Chat]
    DB -->|Fallback & Retry Queue| SyncService[Sync Worker / Retry Mechanism]
    SyncService -->|Retry offline syncs| Sheets
```

---

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py                     # FastAPI application entry point & CORS
│   ├── config.py                   # Pydantic environment configuration
│   ├── database.py                 # SQLAlchemy engine & session dependency
│   ├── models.py                   # SQLAlchemy ORM models (Order, Item, Enquiry, etc.)
│   ├── schemas.py                  # Pydantic request/response validation schemas
│   ├── requirements.txt            # Python dependencies
│   ├── routers/
│   │   ├── config_router.py        # GET /api/config (Public business metadata)
│   │   ├── menu_router.py          # GET /api/menu/categories, GET /api/menu/items
│   │   ├── orders_router.py        # POST /api/orders, GET /api/orders/track
│   │   ├── enquiries_router.py     # POST /api/enquiries
│   │   └── admin_router.py         # GET /api/admin/orders, PATCH status, /health
│   ├── services/
│   │   ├── whatsapp_service.py     # WhatsApp formatted message & URL generation
│   │   ├── google_sheets_service.py# Google Sheets API live sync & retry worker
│   │   └── seed_data.py            # Automatic menu database seeding
│   └── tests/
│       ├── test_api.py             # Pytest test suite (100% pass)
│       └── e2e_live_test.py        # Live full-stack integration test script
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main layout with dynamic config & navigation
│   │   ├── components/
│   │   │   ├── HomePage.tsx        # Hero, stories, chef picks, reviews
│   │   │   ├── MenuPage.tsx        # Dynamic menu categories, filtering, search
│   │   │   ├── OrderNowPage.tsx    # Cart drawer, checkout modal, order confirmation & live tracking
│   │   │   ├── ContactPage.tsx     # Enquiry & table booking with WhatsApp redirect
│   │   │   ├── AboutPage.tsx       # Dhaba heritage & values
│   │   │   ├── GalleryPage.tsx     # Photo gallery with lightbox
│   │   │   ├── ReviewsPage.tsx     # Google reviews & ratings
│   │   │   └── data.ts             # Default fallback data & brand constants
│   │   └── services/
│   │       └── api.ts              # Strongly-typed frontend API client
│   └── styles/                     # TailwindCSS v4 and custom typography styles
├── package.json
├── vite.config.ts                  # Vite config with API proxy to port 8000
├── .env.example                    # Documented environment variables template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (v22 recommended)
- **Python**: v3.10+ (v3.13 tested)
- **MySQL**: (Optional for production; defaults to SQLite for local development)

---

### 2. Backend Setup

1. **Create and activate a Python virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root or `backend/.env`:
   ```bash
   cp .env.example .env
   ```

4. **Run Backend Server**:
   ```bash
   uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - API Docs will be available at: `http://127.0.0.1:8000/docs`
   - Health Check: `http://127.0.0.1:8000/api/admin/health`

---

### 3. Frontend Setup

1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Run Vite Development Server**:
   ```bash
   npm run dev
   ```
   - Access the application at: `http://localhost:5173`

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./dhaba.db` | Primary DB connection string (`mysql+pymysql://user:pass@host:3306/db`) |
| `DHABA_NAME` | `Sardaar Ji Dhaba` | Restaurant brand name |
| `DHABA_PHONE` | `+91 8882897431` | Formatted phone number |
| `DHABA_PHONE_RAW` | `918882897431` | Raw numeric phone for calls |
| `DHABA_WHATSAPP_NUMBER` | `918882897431` | WhatsApp business number |
| `DHABA_EMAIL` | `sardaarjidhaba@gmail.com` | Official contact email |
| `DHABA_ADDRESS` | `138C, Mahatma Gandhi Marg...` | Full physical address |
| `TAX_RATE` | `0.05` | GST rate (5%) |
| `DELIVERY_FEE` | `30.0` | Standard delivery fee (₹) |
| `FREE_DELIVERY_THRESHOLD` | `500.0` | Free delivery for orders above this amount |
| `PACKAGING_FEE` | `15.0` | Packaging fee (₹) |
| `GOOGLE_SHEETS_ENABLED` | `True` | Enable/disable Google Sheets live syncing |
| `GOOGLE_SHEETS_CREDENTIALS_FILE` | `service_account.json` | Path to Google Service Account credentials JSON |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | `""` | Optional inline JSON string for cloud/serverless hosts |
| `GOOGLE_SHEET_NAME` | `Sardaar Ji Dhaba - Live Orders` | Target Google Spreadsheet name |

---

## 📊 Google Sheets API Setup Guide

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **Google Sheets API** and **Google Drive API**.
3. Under **Credentials**, create a **Service Account** and generate a **JSON Key**.
4. Save the downloaded JSON key file as `service_account.json` in the project root (or set `GOOGLE_SERVICE_ACCOUNT_JSON` in your `.env`).
5. Share your Google Sheet with the `client_email` address found inside the JSON key with **Editor** permissions.
6. When an order is placed, it will automatically append a row with full order breakdown, totals, customer details, and timestamp.

---

## 🧪 Testing

### Automated Backend Unit & Integration Tests
Run all test suites with pytest:
```bash
python -m pytest backend/tests
```

### Live System Verification
Run live end-to-end simulation against running servers:
```bash
python backend/tests/e2e_live_test.py
```

---

## 📦 Production Deployment

### Option A: Docker / Container
Run with standard Python 3.13 container and mount `service_account.json`:
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Option B: Cloud VPS / Server (Ubuntu / Debian / Windows Server)
1. Build frontend: `npm run build`
2. Configure Nginx / Reverse Proxy to forward `/api` requests to port `8000` and serve static files from `dist/`.
3. Manage backend process with `systemd` or `pm2` / `supervisord`.

---

## 📄 License
All rights reserved © Sardaar Ji Dhaba, Prayagraj.