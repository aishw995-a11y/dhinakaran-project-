from sqlalchemy.orm import Session
from .models import User, Sale, PredictionHistory
from .schemas import UserCreate, SaleCreate, SaleUpdate
from .auth import get_password_hash
import uuid

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower()).first()

def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=f"user-{uuid.uuid4().hex[:8]}",
        name=user.name,
        email=user.email.lower(),
        password_hash=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_sales(db: Session, user_id: str, skip: int = 0, limit: int = 20, search: str = "", category: str = "", region: str = ""):
    query = db.query(Sale).filter(Sale.user_id == user_id)
    if search:
        query = query.filter(
            (Sale.order_id.ilike(f"%{search}%")) |
            (Sale.product_name.ilike(f"%{search}%")) |
            (Sale.category.ilike(f"%{search}%"))
        )
    if category and category != "All":
        query = query.filter(Sale.category == category)
    if region and region != "All":
        query = query.filter(Sale.region == region)
        
    total = query.count()
    records = query.order_by(Sale.order_date.desc()).offset(skip).limit(limit).all()
    return records, total

def create_sale(db: Session, sale: SaleCreate, user_id: str):
    rev = sale.revenue if sale.revenue is not None else sale.quantity * sale.unit_price
    cost = sale.cost if sale.cost is not None else rev * 0.4
    profit = sale.profit if sale.profit is not None else rev - cost

    db_sale = Sale(
        id=f"sale-{uuid.uuid4().hex[:8]}",
        user_id=user_id,
        order_id=sale.order_id,
        order_date=sale.order_date,
        product_name=sale.product_name,
        category=sale.category,
        quantity=sale.quantity,
        unit_price=sale.unit_price,
        revenue=rev,
        cost=cost,
        profit=profit,
        region=sale.region
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def delete_sale(db: Session, sale_id: str, user_id: str):
    sale = db.query(Sale).filter(Sale.id == sale_id, Sale.user_id == user_id).first()
    if sale:
        db.delete(sale)
        db.commit()
        return True
    return False
