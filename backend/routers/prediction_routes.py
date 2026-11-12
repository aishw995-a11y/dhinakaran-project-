from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from ..database import get_db
from ..auth import get_current_user
from ..models import User, Sale, PredictionHistory
from ..schemas import TrainRequest, PredictionResult
from ..prediction import build_ml_pipeline

router = APIRouter(prefix="/api/prediction", tags=["Machine Learning Prediction"])

@router.post("/train", response_model=PredictionResult)
def train_model(
    req: TrainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).filter(Sale.user_id == current_user.id).all()
    if not sales:
        raise HTTPException(status_code=400, detail="No sales data available to train model.")

    sales_df = pd.DataFrame([{
        "order_date": s.order_date,
        "revenue": s.revenue
    } for s in sales])

    result = build_ml_pipeline(sales_df, model_name=req.model_name, horizon=req.horizon)

    # Save to PredictionHistory
    pred_step = result["forecast"][0]["predicted_revenue"] if result["forecast"] else 0.0
    hist = PredictionHistory(
        id=f"pred-{pd.Timestamp.now().strftime('%Y%m%d%H%M%S')}",
        user_id=current_user.id,
        model_name=req.model_name,
        forecast_date=result["forecast"][0]["period"] if result["forecast"] else "N/A",
        horizon=req.horizon,
        predicted_revenue=pred_step,
        mae=result["evaluation"]["mae"],
        rmse=result["evaluation"]["rmse"],
        r2=result["evaluation"]["r2"]
    )
    db.add(hist)
    db.commit()

    return result

@router.post("/forecast", response_model=PredictionResult)
def get_forecast(
    req: TrainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).filter(Sale.user_id == current_user.id).all()
    sales_df = pd.DataFrame([{"order_date": s.order_date, "revenue": s.revenue} for s in sales])
    return build_ml_pipeline(sales_df, model_name=req.model_name, horizon=req.horizon)
