export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface SalesRecord {
  id: string;
  user_id: string;
  order_id: string;
  order_date: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  revenue: number;
  cost: number;
  profit: number;
  region: string;
  created_at?: string;
}

export interface KPIOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProfit: number;
  avgOrderValue: number;
  totalCost: number;
  profitMargin: number;
  salesGrowthRate: number;
  predictedNextMonthRevenue: number;
  totalPeriods: number;
}

export interface MonthlySalesPoint {
  month: string;
  revenue: number;
  profit: number;
  cost: number;
  orders: number;
  quantity: number;
  rolling_3m_avg?: number;
}

export interface CategorySalesPoint {
  category: string;
  revenue: number;
  profit: number;
  cost: number;
  orders: number;
  units_sold: number;
  margin_percentage: number;
}

export interface ProductPerformance {
  product_name: string;
  category: string;
  revenue: number;
  profit: number;
  units_sold: number;
  order_count: number;
  avg_price?: number;
  profit_margin: number;
}

export interface RegionSalesPoint {
  region: string;
  revenue: number;
  profit: number;
  orders: number;
  margin: number;
}

export interface ForecastPoint {
  period: string;
  predicted_revenue: number;
  lower_bound: number;
  upper_bound: number;
  confidence_level: number;
}

export interface PredictionResult {
  model_name: string;
  horizon: string;
  evaluation: {
    mae: number;
    rmse: number;
    r2: number;
    mape: number;
    training_samples: number;
    test_samples: number;
  };
  feature_importances: { feature: string; importance: number }[];
  historical_vs_fitted: {
    period: string;
    actual: number;
    predicted: number;
    residual: number;
    is_test: boolean;
  }[];
  forecast: ForecastPoint[];
  model_parameters: any;
}

export interface BusinessInsights {
  topRevenueProduct: { name: string; revenue: number; profit: number } | null;
  topProfitCategory: { name: string; profit: number; margin: number } | null;
  bestRegion: { name: string; revenue: number; orders?: number } | null;
  lowPerformingProduct: { name: string; category?: string; revenue: number; units?: number } | null;
  peakSalesMonth: { month: string; revenue: number };
  salesTrend: string;
  totalRecordsAnalyzed: number;
}

export interface CleaningSummary {
  totalRowsProcessed: number;
  validInserted: number;
  duplicatesHandled: number;
  inferredFields: number;
  dataHygieneScore: string;
}
