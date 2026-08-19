import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import init_db, SessionLocal
from backend.services.seed_data import seed_menu_data
from backend.routers import (
    config_router,
    menu_router,
    orders_router,
    enquiries_router,
    admin_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sardaar_ji_dhaba")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for DB creation and data seeding."""
    logger.info("Initializing Sardaar Ji Dhaba Database...")
    init_db()

    # Seed default menu categories and dishes if empty
    db = SessionLocal()
    try:
        seed_menu_data(db)
    except Exception as e:
        logger.error(f"Error during menu data seeding: {e}")
    finally:
        db.close()

    logger.info("Sardaar Ji Dhaba Backend successfully initialized.")
    yield
    logger.info("Shutting down Sardaar Ji Dhaba Backend.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready FastAPI backend for Sardaar Ji Dhaba, Prayagraj.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for 100% production compatibility across Vercel, Netlify, localhost, and custom domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(config_router.router)
app.include_router(menu_router.router)
app.include_router(orders_router.router)
app.include_router(enquiries_router.router)
app.include_router(admin_router.router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.DHABA_NAME} API ({settings.DHABA_SUBTITLE})",
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
