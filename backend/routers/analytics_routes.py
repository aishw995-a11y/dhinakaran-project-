from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
from ..analytics import compute_overview_kpis, compute_monthly_analytics, compute_category_analytics, compute_region_analytics
from ..insights import generate_business_insights

router = APIRouter(prefix="/api/analytics", tags=["Analytics Engine"])

@router.get("/overview")
def get_overview(
    category: str = "",
    region: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return compute_overview_kpis(db, user_id=current_user.id, category=category, region=region)

@router.get("/monthly")
def get_monthly(
    category: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return compute_monthly_analytics(db, user_id=current_user.id, category=category)

@router.get("/category")
def get_category_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return compute_category_analytics(db, user_id=current_user.id)

@router.get("/regions")
def get_regions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return compute_region_analytics(db, user_id=current_user.id)
