from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import pandas as pd
import io
from ..database import get_db
from ..schemas import SaleCreate, SaleResponse, SaleUpdate
from ..crud import get_sales, create_sale, delete_sale
from ..auth import get_current_user
from ..models import User, Sale
from ..data_processing import clean_and_validate_dataframe

router = APIRouter(prefix="/api/sales", tags=["Sales Management"])

@router.get("/")
def list_sales(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    category: str = "",
    region: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skip = (page - 1) * limit
    records, total = get_sales(db, user_id=current_user.id, skip=skip, limit=limit, search=search, category=category, region=region)
    return {
        "records": records,
        "pagination": {
            "page": page,
            "limit": limit,
            "totalRecords": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

@router.post("/", response_model=SaleResponse)
def add_sale(sale: SaleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_sale(db, sale=sale, user_id=current_user.id)

@router.post("/upload")
async def upload_sales_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith((".xls", ".xlsx")):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")

    clean_res = clean_and_validate_dataframe(df)
    
    # Store in database
    for row in clean_res["records"]:
        s = Sale(
            id=f"sale-{pd.util.hash_pandas_object(pd.Series(row)).iloc[0]}",
            user_id=current_user.id,
            order_id=str(row["order_id"]),
            order_date=str(row["order_date"]),
            product_name=str(row["product_name"]),
            category=str(row["category"]),
            quantity=int(row["quantity"]),
            unit_price=float(row["unit_price"]),
            revenue=float(row["revenue"]),
            cost=float(row["cost"]),
            profit=float(row["profit"]),
            region=str(row["region"])
        )
        db.add(s)
    db.commit()

    return {"message": "Data ingested successfully", "cleaningSummary": clean_res["summary"]}

@router.delete("/{sale_id}")
def remove_sale(sale_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_sale(db, sale_id=sale_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Sale record not found")
    return {"message": "Record deleted"}
