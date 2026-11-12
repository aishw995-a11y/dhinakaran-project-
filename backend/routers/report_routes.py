from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
import pandas as pd
from ..database import get_db
from ..auth import get_current_user
from ..models import User, Sale
from ..insights import generate_business_insights

router = APIRouter(prefix="/api/reports", tags=["Reports and Export"])

@router.get("/export-csv")
def export_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).filter(Sale.user_id == current_user.id).all()
    df = pd.DataFrame([{
        "Order_ID": s.order_id,
        "Order_Date": s.order_date,
        "Product_Name": s.product_name,
        "Category": s.category,
        "Quantity": s.quantity,
        "Unit_Price": s.unit_price,
        "Revenue": s.revenue,
        "Cost": s.cost,
        "Profit": s.profit,
        "Region": s.region
    } for s in sales])

    csv_data = df.to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="salespredict_export.csv"'}
    )

@router.get("/summary")
def get_report_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    insights = generate_business_insights(db, user_id=current_user.id)
    return {
        "report": "Executive Sales & ML Forecast Summary",
        "insights": insights
    }
