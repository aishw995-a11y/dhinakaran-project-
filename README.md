# SalesPredict AI – Sales Prediction and Business Analytics System

[![B.Tech AI & Data Science Project](https://img.shields.io/badge/Academic%20Project-B.Tech%20AI%20%26%20DS-blue.svg)](#)
[![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--learn-orange.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%26%20Node%20Express-emerald.svg)](#)
[![Database](https://img.shields.io/badge/Database-SQLite%203-003B57.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB.svg)](#)
[![AI Integration](https://img.shields.io/badge/AI%20Strategic%20Advisory-Gemini%203.8%20Flash-8E75C4.svg)](#)

A full-stack, enterprise-grade Sales Prediction and Business Analytics System engineered for a third-year **B.Tech Artificial Intelligence and Data Science** academic curriculum.

---

## 1. Project Objective & Architecture

Modern enterprises require predictive foresight into seasonal demand, gross margins, and future cash flows. SalesPredict AI provides an end-to-end machine learning and business intelligence workspace that transforms raw transactional sales records into actionable forecasts.

### Key Capabilities:
- **Dual Machine Learning Pipeline**: Baseline regularized Linear Regression (Ridge) and ensemble Random Forest Regressor with bootstrap variance reduction.
- **Zero Temporal Data Leakage**: Enforces strict chronological 80/20 train-test splitting instead of randomized k-fold splits.
- **Time-Series Feature Engineering**: Autoregressive lags ($t-1, t-2, t-3$), rolling 3-month moving averages, seasonal trigonometric coordinates ($\sin(2\pi m/12), \cos(2\pi m/12)$), and growth trend indices.
- **Multi-Horizon Forecasting**: 7 Days, 30 Days, 3 Months, and 6 Months recursive autoregressive projections with statistical 95% confidence intervals ($\pm 1.96 \times \text{std\_err}$).
- **Automated Data Hygiene & Cleaning**: Ingestion pipeline for CSV/Excel datasets that detects missing values, recalculates missing revenue/profit, resolves duplicate order keys, and produces a hygiene score.
- **Interactive Recharts Dashboards**: Monthly sales trends, category revenue distribution, net profit contribution, geographic territory analysis, and top-performing products.
- **Gemini 3.8 Flash Strategic Advisory**: Ingests verified calculated analytics to synthesize executive strategic decisions without numerical hallucinations.
- **Formatted Printable Reports & Exports**: Generate print-ready PDF executive summaries and export filtered transactions to CSV.

---

## 2. Machine Learning Mathematical Formulations

### A. Chronological Split (Prevention of Future Look-Ahead Leakage)
In time-series forecasting, random splits leak future trends into past training records. We enforce:
$$\mathcal{D}_{\text{train}} = \{(X_t, y_t) \mid t \le 0.80 \times T\}$$
$$\mathcal{D}_{\text{test}} = \{(X_t, y_t) \mid t > 0.80 \times T\}$$

### B. Feature Vector Formulation
For each period $t$:
$$X_t = \left[ 1, \; y_{t-1}, \; y_{t-2}, \; y_{t-3}, \; \text{MA}_{3}(t), \; \frac{t}{10}, \; \sin\left(\frac{2\pi m_t}{12}\right), \; \cos\left(\frac{2\pi m_t}{12}\right) \right]^T$$

### C. Linear Regression (L2 Regularized Ridge)
$$w = (X^T X + \lambda I)^{-1} X^T y$$

### D. Random Forest Regressor Ensemble
Ensemble of $B = 15$ decision trees trained on bootstrap samples:
$$\hat{y}(X) = \frac{1}{B} \sum_{b=1}^B T_b(X)$$

### E. Model Evaluation Metrics
1. **Mean Absolute Error (MAE)**:
   $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |y_i - \hat{y}_i|$$
2. **Root Mean Squared Error (RMSE)**:
   $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2}$$
3. **Coefficient of Determination ($R^2$ Score)**:
   $$R^2 = 1 - \frac{\sum_{i=1}^N (y_i - \hat{y}_i)^2}{\sum_{i=1}^N (y_i - \bar{y})^2}$$
4. **Mean Absolute Percentage Error (MAPE)**:
   $$\text{MAPE} = \frac{100\%}{N} \sum_{i=1}^N \left| \frac{y_i - \hat{y}_i}{y_i} \right|$$

### F. Statistical 95% Confidence Intervals
For horizon step $h$:
$$\sigma_h = \text{RMSE} \times \sqrt{1 + 0.25h}$$
$$\text{CI}_{95\%} = \left[ \hat{y}_{t+h} - 1.96 \sigma_h, \; \hat{y}_{t+h} + 1.96 \sigma_h \right]$$

---

## 3. Directory Structure

```
salespredict-ai/
├── backend/                        # Modular Python FastAPI Microservice
│   ├── main.py                     # FastAPI application entrypoint & CORS
│   ├── database.py                 # SQLAlchemy database connection & session
│   ├── models.py                   # ORM models (User, Sale, PredictionHistory)
│   ├── schemas.py                  # Pydantic validation schemas
│   ├── auth.py                     # JWT token generator & bcrypt password hashing
│   ├── crud.py                     # Database CRUD operations
│   ├── data_processing.py          # CSV/Excel validation, missing values & hygiene
│   ├── analytics.py                # Aggregation engine for KPIs and categories
│   ├── prediction.py               # Scikit-learn Linear Regression & Random Forest
│   ├── insights.py                 # Rule-based business intelligence generator
│   ├── requirements.txt            # Python dependencies
│   └── routers/
│       ├── auth_routes.py          # /api/auth endpoints
│       ├── sales_routes.py         # /api/sales endpoints & file upload
│       ├── analytics_routes.py     # /api/analytics endpoints
│       ├── prediction_routes.py    # /api/prediction endpoints
│       └── report_routes.py        # /api/reports export endpoints
├── src/                            # React 19 + TypeScript Frontend
│   ├── assets/images/              # High-fidelity visual assets & avatars
│   ├── components/
│   │   ├── common/                 # KPICard, UploadModal, RecordModal
│   │   └── layout/                 # Navbar (3-zone contract), Sidebar drawer
│   ├── contexts/                   # AuthContext, SalesContext
│   ├── pages/                      # DashboardPage, PredictionPage, AnalyticsPage,
│   │                               # SalesDataPage, InsightsPage, ReportsPage,
│   │                               # SettingsPage, LandingPage, AuthPage
│   ├── services/                   # api.ts (Typed API client)
│   ├── types/                      # TypeScript definitions
│   ├── App.tsx                     # Root router & layout wrapper
│   ├── main.tsx                    # React DOM root entrypoint
│   └── index.css                   # Tailwind CSS v4 styling & print media rules
├── public/
│   └── sample_sales_data.csv       # Pre-built realistic multi-quarter sales dataset
├── server.ts                       # Unified Full-Stack Express + SQLite server
├── sample_sales_data.csv           # Root dataset copy for quick testing
├── package.json                    # Node dependencies & full-stack scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 4. How to Run Locally

### Option A: Unified Full-Stack Development (Default AI Studio Runtime)
Runs the React 19 frontend and the Express + SQLite backend together on port 3000:

```bash
# 1. Install Node.js dependencies
npm install

# 2. Start the unified development server
npm run dev

# 3. Access in browser
http://localhost:3000
```

### Option B: Standalone Python FastAPI Backend
If running the Python backend independently for academic submission or testing:

```bash
# 1. Navigate to backend directory and create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# 4. View interactive Swagger API Docs
http://localhost:8000/docs
```

---

## 5. Expected Sales Dataset Format

When uploading a custom CSV or Excel dataset, the following columns are expected:

| Column Name | Data Type | Required | Description |
|:---|:---|:---:|:---|
| `Order_ID` | String | Yes | Unique order reference code (e.g. `ORD-2025-1001`) |
| `Order_Date` | Date String | Yes | Transaction date in `YYYY-MM-DD` format |
| `Product_Name` | String | Yes | Name of product or service sold |
| `Category` | String | Yes | Business division (e.g. `Cloud Infrastructure`) |
| `Quantity` | Integer | Yes | Units purchased ($\ge 1$) |
| `Unit_Price` | Float | Yes | Price per unit in USD |
| `Revenue` | Float | Optional | Auto-calculated as `Quantity * Unit_Price` if omitted |
| `Cost` | Float | Optional | Auto-calculated as `Revenue * 0.40` if omitted |
| `Profit` | Float | Optional | Auto-calculated as `Revenue - Cost` if omitted |
| `Region` | String | Yes | Geographic territory (e.g. `North America`, `Europe`) |

---

## 6. Pre-Configured Demo Credentials

For quick evaluation and grading:
- **Email**: `demo@salespredict.ai`
- **Password**: `demo12345`
- Or click **"Quick Access as Lead Analyst"** on the Sign In page for one-click access!

---

## 7. License & Academic Attribution
Developed as a third-year B.Tech Artificial Intelligence and Data Science project. Released under the Apache 2.0 License.
