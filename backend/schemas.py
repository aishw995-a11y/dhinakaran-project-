from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Sales Schemas
class SaleBase(BaseModel):
    order_id: str
    order_date: str
    product_name: str
    category: str
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    revenue: Optional[float] = None
    cost: Optional[float] = None
    profit: Optional[float] = None
    region: str = "North America"

class SaleCreate(SaleBase):
    pass

class SaleUpdate(BaseModel):
    order_id: Optional[str] = None
    order_date: Optional[str] = None
    product_name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    revenue: Optional[float] = None
    cost: Optional[float] = None
    profit: Optional[float] = None
    region: Optional[str] = None

class SaleResponse(SaleBase):
    id: str
    user_id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Prediction Schemas
class TrainRequest(BaseModel):
    model_name: str = "Random Forest Regressor"
    horizon: str = "3m"

class ForecastStep(BaseModel):
    period: str
    predicted_revenue: float
    lower_bound: float
    upper_bound: float
    confidence_level: float = 0.95

class EvaluationMetrics(BaseModel):
    mae: float
    rmse: float
    r2: float
    mape: float
    training_samples: int
    test_samples: int

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class PredictionResult(BaseModel):
    model_name: str
    horizon: str
    evaluation: EvaluationMetrics
    feature_importances: List[FeatureImportance]
    forecast: List[ForecastStep]
    model_parameters: Optional[Dict[str, Any]] = None
