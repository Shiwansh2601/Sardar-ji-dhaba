from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from backend.database import get_db
from backend.models import MenuCategory, MenuItem
from backend.schemas import MenuCategoryResponse, MenuItemResponse

router = APIRouter(prefix="/api/menu", tags=["Menu"])


@router.get("/categories", response_model=List[MenuCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Returns all menu categories with their active items."""
    categories = (
        db.query(MenuCategory)
        .options(joinedload(MenuCategory.items))
        .order_by(MenuCategory.sort_order.asc())
        .all()
    )
    return categories


@router.get("/items", response_model=List[MenuItemResponse])
def get_menu_items(
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    item_type: Optional[str] = Query(None, description="Filter by type (veg / non-veg)"),
    popular: Optional[bool] = Query(None, description="Filter popular items"),
    query: Optional[str] = Query(None, description="Search query by name/description"),
    db: Session = Depends(get_db),
):
    """Returns menu items with optional category, type, popular, and text search filters."""
    q = db.query(MenuItem).filter(MenuItem.available == True)

    if category_id:
        q = q.filter(MenuItem.category_id == category_id)
    if item_type:
        q = q.filter(MenuItem.type == item_type)
    if popular is not None:
        q = q.filter(MenuItem.popular == popular)
    if query:
        term = f"%{query.strip()}%"
        q = q.filter((MenuItem.name.ilike(term)) | (MenuItem.desc.ilike(term)))

    return q.order_by(MenuItem.id.asc()).all()
