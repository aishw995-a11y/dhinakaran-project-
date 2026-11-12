from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_routes, sales_routes, analytics_routes, prediction_routes, report_routes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SalesPredict AI – Backend API",
    description="Full-stack Machine Learning Sales Prediction and Business Analytics System (B.Tech AI & Data Science Academic Project)",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_routes.router)
app.include_router(sales_routes.router)
app.include_router(analytics_routes.router)
app.include_router(prediction_routes.router)
app.include_router(report_routes.router)

@app.get("/")
def root():
    return {
        "project": "SalesPredict AI – Sales Prediction and Business Analytics System",
        "status": "online",
        "documentation": "/docs",
        "ml_models": ["Linear Regression (Ridge)", "Random Forest Regressor"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
