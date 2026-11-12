import pandas as pd
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from .models import Sale

def compute_overview_kpis(db: Session, user_id: str, category: str = "", region: str = "") -> Dict[str, Any]:
    query = db.query(Sale).filter(Sale.user_id == user_id)
    if category and category != "All":
        query = query.filter(Sale.category == category)
    if region and region != "All":
        query = query.filter(Sale.region == region)
        
    records = query.all()
    if not records:
        return {
            "totalRevenue": 0,
            "totalOrders": 0,
            "totalProfit": 0,
            "avgOrderValue": 0,
            "totalCost": 0,
            "profitMargin": 0,
            "salesGrowthRate": 0,
            "predictedNextMonthRevenue": 0,
            "totalPeriods": 0
        }

    df = pd.DataFrame([{
        "revenue": r.revenue,
        "cost": r.cost,
        "profit": r.profit,
        "quantity": r.quantity,
        "order_date": r.order_date
    } for r in records])

    tot_rev = float(df["revenue"].sum())
    tot_profit = float(df["profit"].sum())
    tot_cost = float(df["cost"].sum())
    tot_orders = len(df)
    aov = tot_rev / max(1, tot_orders)
    margin = (tot_profit / tot_rev * 100) if tot_rev > 0 else 0

    # Growth rate MoM
    df["month"] = pd.to_datetime(df["order_date"]).dt.to_period("M").astype(str)
    monthly_rev = df.groupby("month")["revenue"].sum().sort_index()
    growth_rate = 0.0
    if len(monthly_rev) >= 2:
        curr = monthly_rev.iloc[-1]
        prior = monthly_rev.iloc[-2]
        growth_rate = ((curr - prior) / prior * 100) if prior > 0 else 0.0

    return {
        "totalRevenue": round(tot_rev, 2),
        "totalOrders": tot_orders,
        "totalProfit": round(tot_profit, 2),
        "avgOrderValue": round(aov, 2),
        "totalCost": round(tot_cost, 2),
        "profitMargin": round(margin, 1),
        "salesGrowthRate": round(growth_rate, 1),
        "predictedNextMonthRevenue": round(tot_rev / max(1, len(monthly_rev)) * 1.05, 2),
        "totalPeriods": len(monthly_rev)
    }

def compute_monthly_analytics(db: Session, user_id: str, category: str = "") -> List[Dict[str, Any]]:
    query = db.query(Sale).filter(Sale.user_id == user_id)
    if category and category != "All":
        query = query.filter(Sale.category == category)
    records = query.all()
    if not records:
        return []

    df = pd.DataFrame([{
        "month": str(r.order_date)[:7],
        "revenue": r.revenue,
        "profit": r.profit,
        "cost": r.cost,
        "quantity": r.quantity
    } for r in records])

    grouped = df.groupby("month").agg({
        "revenue": "sum",
        "profit": "sum",
        "cost": "sum",
        "quantity": "sum"
    }).reset_index().sort_values("month")

    grouped["orders"] = df.groupby("month").size().values
    grouped["rolling_3m_avg"] = grouped["revenue"].rolling(window=3, min_periods=1).mean().round(2)

    return grouped.to_dict(orient="records")

def compute_category_analytics(db: Session, user_id: str) -> List[Dict[str, Any]]:
    records = db.query(Sale).filter(Sale.user_id == user_id).all()
    if not records:
        return []

    df = pd.DataFrame([{
        "category": r.category,
        "revenue": r.revenue,
        "profit": r.profit,
        "cost": r.cost,
        "quantity": r.quantity
    } for r in records])

    grouped = df.groupby("category").agg({
        "revenue": "sum",
        "profit": "sum",
        "cost": "sum",
        "quantity": "sum"
    }).reset_index().sort_values("revenue", ascending=False)

    grouped["orders"] = df.groupby("category").size().values
    grouped["margin_percentage"] = ((grouped["profit"] / grouped["revenue"]) * 100).round(1)

    return grouped.to_dict(orient="records")

def compute_region_analytics(db: Session, user_id: str) -> List[Dict[str, Any]]:
    records = db.query(Sale).filter(Sale.user_id == user_id).all()
    if not records:
        return []

    df = pd.DataFrame([{
        "region": r.region,
        "revenue": r.revenue,
        "profit": r.profit
    } for r in records])

    grouped = df.groupby("region").agg({
        "revenue": "sum",
        "profit": "sum"
    }).reset_index().sort_values("revenue", ascending=False)

    grouped["orders"] = df.groupby("region").size().values
    grouped["margin"] = ((grouped["profit"] / grouped["revenue"]) * 100).round(1)

    return grouped.to_dict(orient="records")
