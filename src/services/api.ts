import {
  User,
  SalesRecord,
  KPIOverview,
  MonthlySalesPoint,
  CategorySalesPoint,
  ProductPerformance,
  RegionSalesPoint,
  PredictionResult,
  BusinessInsights,
  CleaningSummary,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('salespredict_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errJson.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => request<{ user: User; stats: { totalRecords: number } }>('/auth/profile'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Sales
  getSales: (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    region?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.region) query.append('region', params.region);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    return request<{
      records: SalesRecord[];
      pagination: { page: number; limit: number; totalRecords: number; totalPages: number };
      filters: { categories: string[]; regions: string[] };
    }>(`/sales?${query.toString()}`);
  },

  createSale: (sale: Partial<SalesRecord>) =>
    request<{ message: string; id: string }>('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    }),

  updateSale: (id: string, sale: Partial<SalesRecord>) =>
    request<{ message: string }>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sale),
    }),

  deleteSale: (id: string) =>
    request<{ message: string }>(`/sales/${id}`, {
      method: 'DELETE',
    }),

  uploadSales: (data: { csvData?: string; records?: any[]; replaceExisting?: boolean }) =>
    request<{ message: string; cleaningSummary: CleaningSummary }>('/sales/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetDemoData: () =>
    request<{ message: string }>('/sales/reset-demo', {
      method: 'POST',
    }),

  clearAllData: () =>
    request<{ message: string }>('/sales/clear-all', {
      method: 'DELETE',
    }),

  // Analytics
  getOverview: (category?: string, region?: string) => {
    const q = new URLSearchParams();
    if (category) q.append('category', category);
    if (region) q.append('region', region);
    return request<KPIOverview>(`/analytics/overview?${q.toString()}`);
  },

  getMonthlyAnalytics: (category?: string) => {
    const q = new URLSearchParams();
    if (category) q.append('category', category);
    return request<MonthlySalesPoint[]>(`/analytics/monthly?${q.toString()}`);
  },

  getCategoryAnalytics: () => request<CategorySalesPoint[]>('/analytics/category'),

  getProductAnalytics: (limit?: number) =>
    request<{ topProducts: ProductPerformance[]; lowProducts: ProductPerformance[] }>(
      `/analytics/products?limit=${limit || 10}`
    ),

  getRegionAnalytics: () => request<RegionSalesPoint[]>('/analytics/regions'),

  // Prediction
  trainModel: (modelName: string, horizon: string) =>
    request<PredictionResult>('/prediction/train', {
      method: 'POST',
      body: JSON.stringify({ model_name: modelName, horizon }),
    }),

  getForecast: (modelName: string, horizon: string) =>
    request<PredictionResult>('/prediction/forecast', {
      method: 'POST',
      body: JSON.stringify({ model_name: modelName, horizon }),
    }),

  getPredictionMetrics: () =>
    request<{
      randomForest: any;
      linearRegression: any;
      feature_importances: any[];
      historyCount: number;
    }>('/prediction/metrics'),

  // Insights
  getInsights: () => request<BusinessInsights>('/insights'),

  getAIRecommendations: () =>
    request<{
      provider: string;
      data?: {
        executiveSummary?: string;
        strategicRecommendations?: string[];
        riskFactors?: string[];
        growthCatalysts?: string[];
      };
      summary?: string;
      recommendations?: string[];
      contextUsed?: any;
    }>('/insights/ai-recommendations', { method: 'POST' }),

  askQuestion: (question: string) =>
    request<{ answer: string }>('/insights/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),

  // Reports
  getReportSummary: () => request<any>('/reports/summary'),
  getExportCSVUrl: () => `${API_BASE}/reports/export-csv`,
};
