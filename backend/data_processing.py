import pandas as pd
import numpy as np
import io
import uuid
from typing import Dict, Any, List

def clean_and_validate_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Cleans raw uploaded sales data:
    - Normalizes column names
    - Handles missing values
    - Calculates Revenue and Profit automatically if missing
    - Detects and tags duplicate Order IDs
    """
    total_raw_rows = len(df)
    
    # Standardize column headers
    col_map = {}
    for col in df.columns:
        norm = col.strip().lower().replace(" ", "_")
        if "order_id" in norm or norm == "id":
            col_map[col] = "order_id"
        elif "date" in norm:
            col_map[col] = "order_date"
        elif "product" in norm or "item" in norm:
            col_map[col] = "product_name"
        elif "category" in norm:
            col_map[col] = "category"
        elif "quant" in norm or "qty" in norm:
            col_map[col] = "quantity"
        elif "price" in norm or "rate" in norm:
            col_map[col] = "unit_price"
        elif "revenue" in norm or "sales" in norm:
            col_map[col] = "revenue"
        elif "cost" in norm or "expense" in norm:
            col_map[col] = "cost"
        elif "profit" in norm or "margin" in norm:
            col_map[col] = "profit"
        elif "region" in norm or "territory" in norm or "location" in norm:
            col_map[col] = "region"
            
    df = df.rename(columns=col_map)
    
    # Ensure minimum columns
    if "order_id" not in df.columns:
        df["order_id"] = [f"ORD-{uuid.uuid4().hex[:8].upper()}" for _ in range(len(df))]
    if "order_date" not in df.columns:
        df["order_date"] = pd.Timestamp.now().strftime("%Y-%m-%d")
    if "product_name" not in df.columns:
        df["product_name"] = "Standard Item"
    if "category" not in df.columns:
        df["category"] = "General"
    if "quantity" not in df.columns:
        df["quantity"] = 1
    if "unit_price" not in df.columns:
        df["unit_price"] = 100.0
    if "region" not in df.columns:
        df["region"] = "North America"

    # Data type coercions
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(1).astype(int).clip(lower=1)
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce").fillna(50.0).astype(float).clip(lower=0.01)
    
    inferred_count = 0
    if "revenue" not in df.columns or df["revenue"].isna().any():
        df["revenue"] = df["quantity"] * df["unit_price"]
        inferred_count += 1
    else:
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce").fillna(df["quantity"] * df["unit_price"])
        
    if "cost" not in df.columns or df["cost"].isna().any():
        df["cost"] = df["revenue"] * 0.4
        inferred_count += 1
    else:
        df["cost"] = pd.to_numeric(df["cost"], errors="coerce").fillna(df["revenue"] * 0.4)
        
    if "profit" not in df.columns or df["profit"].isna().any():
        df["profit"] = df["revenue"] - df["cost"]
        inferred_count += 1
    else:
        df["profit"] = pd.to_numeric(df["profit"], errors="coerce").fillna(df["revenue"] - df["cost"])

    # Duplicates handling
    duplicates = df[df.duplicated(subset=["order_id"], keep=False)]
    dup_count = len(duplicates)
    if dup_count > 0:
        df["order_id"] = df["order_id"].astype(str) + "-" + df.groupby("order_id").cumcount().astype(str)

    # Convert to valid string date format YYYY-MM-DD
    df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce").dt.strftime("%Y-%m-%d").fillna("2025-01-01")

    valid_records = df.to_dict(orient="records")
    
    return {
        "records": valid_records,
        "summary": {
            "total_rows_read": total_raw_rows,
            "valid_records": len(valid_records),
            "duplicates_resolved": dup_count,
            "inferred_columns": inferred_count,
            "hygiene_score": f"{round((len(valid_records) / max(1, total_raw_rows)) * 100)}%"
        }
    }
