import logging
from sqlalchemy.orm import Session
from backend.models import MenuCategory, MenuItem

logger = logging.getLogger(__name__)

INITIAL_CATEGORIES = [
    {
        "id": "starters",
        "label": "Starters",
        "icon": "🔥",
        "sort_order": 1,
        "items": [
            {"id": 101, "name": "Paneer Tikka", "desc": "Cottage cheese cubes marinated in spiced yogurt & grilled to perfection in a tandoor.", "price": "₹220", "price_num": 220.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 102, "name": "Hara Bhara Kebab", "desc": "Crispy patties of fresh spinach, green peas & potato seasoned with aromatic spices.", "price": "₹180", "price_num": 180.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 103, "name": "Tandoori Mushroom", "desc": "Button mushrooms marinated in tandoori masala & slow-roasted in clay oven.", "price": "₹200", "price_num": 200.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 104, "name": "Dahi ke Sholay", "desc": "Golden bread rolls stuffed with spiced hung curd, capsicum & onion.", "price": "₹190", "price_num": 190.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 105, "name": "Chicken Tikka", "desc": "Succulent chicken pieces marinated in yogurt & aromatic Punjabi spices, chargrilled.", "price": "₹280", "price_num": 280.0, "type": "non-veg", "popular": True, "spicy": False},
            {"id": 106, "name": "Seekh Kebab", "desc": "Minced mutton blended with herbs & spices, skewered & cooked in tandoor.", "price": "₹300", "price_num": 300.0, "type": "non-veg", "popular": False, "spicy": False},
            {"id": 107, "name": "Tandoori Chicken (Half)", "desc": "Classic half chicken marinated overnight in yogurt & spices, roasted on charcoal.", "price": "₹340", "price_num": 340.0, "type": "non-veg", "popular": False, "spicy": True},
            {"id": 108, "name": "Crispy Veg Platter", "desc": "Assorted vegetarian appetisers: baby corn, paneer & vegetable fingers served with dips.", "price": "₹210", "price_num": 210.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "main-veg",
        "label": "Main Course – Veg",
        "icon": "🌿",
        "sort_order": 2,
        "items": [
            {"id": 201, "name": "Dal Makhani", "desc": "Black lentils slow-cooked overnight with butter, cream & a secret blend of spices.", "price": "₹180", "price_num": 180.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 202, "name": "Paneer Butter Masala", "desc": "Soft cottage cheese cubes simmered in a rich tomato-cashew-cream gravy.", "price": "₹240", "price_num": 240.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 203, "name": "Shahi Paneer", "desc": "Royal Mughal-style cottage cheese in a luscious saffron, cashew & cream sauce.", "price": "₹260", "price_num": 260.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 204, "name": "Palak Paneer", "desc": "Fresh baby spinach purée with cottage cheese, tempered with garlic & dried fenugreek.", "price": "₹230", "price_num": 230.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 205, "name": "Kadai Paneer", "desc": "Paneer & bell peppers tossed in a rustic, freshly ground Kadai masala.", "price": "₹240", "price_num": 240.0, "type": "veg", "popular": False, "spicy": True},
            {"id": 206, "name": "Chana Masala", "desc": "Heritage recipe — chickpeas braised in tangy Punjabi masala with pomegranate.", "price": "₹160", "price_num": 160.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 207, "name": "Mix Vegetable", "desc": "Seasonal farm vegetables cooked in a warming North Indian curry base.", "price": "₹170", "price_num": 170.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 208, "name": "Aloo Gobi Masala", "desc": "Potatoes & cauliflower dry-tossed with cumin, turmeric & coriander.", "price": "₹150", "price_num": 150.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "main-nonveg",
        "label": "Main Course – Non-Veg",
        "icon": "🍗",
        "sort_order": 3,
        "items": [
            {"id": 301, "name": "Butter Chicken", "desc": "The classic Punjabi favourite — tender chicken in a velvety tomato-cream sauce.", "price": "₹300", "price_num": 300.0, "type": "non-veg", "popular": True, "spicy": False},
            {"id": 302, "name": "Chicken Curry", "desc": "Traditional home-style Punjabi chicken curry with whole spices & onion masala.", "price": "₹270", "price_num": 270.0, "type": "non-veg", "popular": False, "spicy": False},
            {"id": 303, "name": "Kadai Chicken", "desc": "Chicken pieces with capsicum & onion in a bold, freshly ground Kadai spice blend.", "price": "₹290", "price_num": 290.0, "type": "non-veg", "popular": False, "spicy": True},
            {"id": 304, "name": "Mutton Rogan Josh", "desc": "Slow-cooked mutton shoulder in a Kashmiri-inspired deep red gravy.", "price": "₹380", "price_num": 380.0, "type": "non-veg", "popular": True, "spicy": False},
            {"id": 305, "name": "Keema Matar", "desc": "Minced mutton braised with green peas, tomatoes & aromatic spices.", "price": "₹320", "price_num": 320.0, "type": "non-veg", "popular": False, "spicy": False},
            {"id": 306, "name": "Fish Curry", "desc": "Fresh river fish cooked in a tangy Punjabi mustard & tomato gravy.", "price": "₹280", "price_num": 280.0, "type": "non-veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "breads",
        "label": "Breads",
        "icon": "🫓",
        "sort_order": 4,
        "items": [
            {"id": 401, "name": "Tandoori Roti", "desc": "Whole wheat flatbread baked fresh in the clay oven.", "price": "₹30", "price_num": 30.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 402, "name": "Butter Naan", "desc": "Soft leavened bread brushed with generous butter, straight from the tandoor.", "price": "₹45", "price_num": 45.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 403, "name": "Garlic Naan", "desc": "Naan bread topped with minced garlic, coriander & butter.", "price": "₹55", "price_num": 55.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 404, "name": "Lachha Paratha", "desc": "Multi-layered flaky whole wheat flatbread, crispy on the outside, soft within.", "price": "₹60", "price_num": 60.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 405, "name": "Puri (2 pcs)", "desc": "Deep-fried puffed whole wheat bread — best paired with Aloo or Chana.", "price": "₹40", "price_num": 40.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 406, "name": "Missi Roti", "desc": "Rustic Punjabi flatbread made with gram & wheat flour, seasoned with ajwain.", "price": "₹35", "price_num": 35.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "rice",
        "label": "Rice & Biryani",
        "icon": "🍚",
        "sort_order": 5,
        "items": [
            {"id": 501, "name": "Veg Biryani", "desc": "Aromatic long-grain basmati rice layered with seasonal vegetables & whole spices.", "price": "₹200", "price_num": 200.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 502, "name": "Chicken Biryani", "desc": "Fragrant Lucknawi-style dum biryani with tender chicken pieces.", "price": "₹300", "price_num": 300.0, "type": "non-veg", "popular": True, "spicy": False},
            {"id": 503, "name": "Mutton Biryani", "desc": "Royal slow-cooked mutton dum biryani with caramelised onions & saffron.", "price": "₹380", "price_num": 380.0, "type": "non-veg", "popular": False, "spicy": False},
            {"id": 504, "name": "Steamed Rice", "desc": "Fluffy long-grain basmati rice, the perfect accompaniment.", "price": "₹100", "price_num": 100.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 505, "name": "Jeera Rice", "desc": "Basmati rice tempered with cumin, bay leaf & whole spices.", "price": "₹130", "price_num": 130.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 506, "name": "Dal Khichdi", "desc": "Comforting slow-cooked rice & lentil preparation with a tadka of ghee & spices.", "price": "₹160", "price_num": 160.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "desserts",
        "label": "Desserts",
        "icon": "🍮",
        "sort_order": 6,
        "items": [
            {"id": 601, "name": "Gulab Jamun (2 pcs)", "desc": "Soft khoya balls soaked in rose-cardamom sugar syrup, served warm.", "price": "₹80", "price_num": 80.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 602, "name": "Phirni", "desc": "Creamy chilled rice pudding flavoured with cardamom, saffron & rose water.", "price": "₹90", "price_num": 90.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 603, "name": "Rasmalai", "desc": "Delicate cottage cheese dumplings soaked in chilled saffron-flavoured milk.", "price": "₹110", "price_num": 110.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 604, "name": "Gajar Halwa", "desc": "Slow-cooked grated carrot pudding with khoya, ghee & dry fruits. (Seasonal)", "price": "₹110", "price_num": 110.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 605, "name": "Kulfi (Malai)", "desc": "Traditional creamy Indian ice cream set in a cone, flavoured with cardamom.", "price": "₹90", "price_num": 90.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
    {
        "id": "drinks",
        "label": "Drinks",
        "icon": "🥛",
        "sort_order": 7,
        "items": [
            {"id": 701, "name": "Sweet Lassi", "desc": "Chilled, whipped yogurt drink sweetened with sugar & topped with malai.", "price": "₹80", "price_num": 80.0, "type": "veg", "popular": True, "spicy": False},
            {"id": 702, "name": "Salted Lassi", "desc": "Refreshing yogurt drink seasoned with roasted cumin & fresh mint.", "price": "₹80", "price_num": 80.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 703, "name": "Mango Lassi", "desc": "Thick yogurt blended with Alphonso mango pulp — a summer favourite.", "price": "₹110", "price_num": 110.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 704, "name": "Masala Chai", "desc": "Fragrant spiced Indian tea brewed with ginger, cardamom & milk.", "price": "₹30", "price_num": 30.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 705, "name": "Fresh Lime Soda", "desc": "Freshly squeezed lime with soda — sweet, salted, or masala.", "price": "₹55", "price_num": 55.0, "type": "veg", "popular": False, "spicy": False},
            {"id": 706, "name": "Soft Drinks", "desc": "Pepsi, 7Up, Sprite, Miranda — chilled bottle.", "price": "₹40", "price_num": 40.0, "type": "veg", "popular": False, "spicy": False},
        ],
    },
]


def seed_menu_data(db: Session):
    """Populates database with initial Sardaar Ji Dhaba menu if tables are empty."""
    existing_count = db.query(MenuCategory).count()
    if existing_count > 0:
        return

    logger.info("Seeding initial Sardaar Ji Dhaba menu data into database...")
    for cat_data in INITIAL_CATEGORIES:
        category = MenuCategory(
            id=cat_data["id"],
            label=cat_data["label"],
            icon=cat_data["icon"],
            sort_order=cat_data["sort_order"],
        )
        db.add(category)

        for item_data in cat_data["items"]:
            item = MenuItem(
                id=item_data["id"],
                category_id=cat_data["id"],
                name=item_data["name"],
                desc=item_data["desc"],
                price=item_data["price"],
                price_num=item_data["price_num"],
                type=item_data["type"],
                popular=item_data.get("popular", False),
                spicy=item_data.get("spicy", False),
                available=True,
            )
            db.add(item)

    db.commit()
    logger.info("Menu data successfully seeded.")
