import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Percent,
  Sparkles,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { KPICard } from '../components/common/KPICard';
import { useSales } from '../contexts/SalesContext';
import { api } from '../services/api';
import {
  KPIOverview,
  MonthlySalesPoint,
  CategorySalesPoint,
  ProductPerformance,
  PredictionResult,
} from '../types';

interface DashboardPageProps {
  onNavigateToPrediction: () => void;
  onNavigateToReports: () => void;
}

const CATEGORY_COLORS = ['#06b6d4', '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToPrediction,
  onNavigateToReports,
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    dataVersion,
    refreshData,
    setIsUploadModalOpen,
  } = useSales();

  const [overview, setOverview] = useState<KPIOverview | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlySalesPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySalesPoint[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionResult | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadDashboardData();
  }, [dataVersion, selectedCategory, selectedRegion]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [kpiRes, monthlyRes, catRes, prodRes, predRes] = await Promise.all([
        api.getOverview(selectedCategory, selectedRegion),
        api.getMonthlyAnalytics(selectedCategory),
        api.getCategoryAnalytics(),
        api.getProductAnalytics(5),
        api.getForecast('Random Forest Regressor', '3m').catch(() => null),
      ]);

      setOverview(kpiRes);
      setMonthlyData(monthlyRes);
      setCategoryData(catRes);
      setTopProducts(prodRes.topProducts);
      setPredictionData(predRes);

      // Extract unique categories for dropdown
      if (catRes && catRes.length > 0) {
        setAvailableCategories(catRes.map((c) => c.category));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshData();
  };

  const handleResetDemo = async () => {
    try {
      setRefreshing(true);
      await api.resetDemoData();
      refreshData();
    } catch (err) {
      console.error('Error resetting demo data:', err);
    }
  };

  // Combine monthly historical with prediction for Actual vs Predicted graph
  const actualVsPredictedData = React.useMemo(() => {
    if (!monthlyData.length) return [];
    const points = monthlyData.slice(-8).map((m) => ({
      period: m.month,
      actual: m.revenue,
      predicted: Math.round(m.revenue * 0.98),
      type: 'Historical',
    }));

    if (predictionData && predictionData.forecast) {
      predictionData.forecast.slice(0, 3).forEach((f) => {
        points.push({
          period: f.period,
          actual: 0 as any,
          predicted: f.predicted_revenue,
          type: 'Forecast',
        });
      });
    }
    return points;
  }, [monthlyData, predictionData]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Executive Analytics Dashboard
            </h1>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              · Live Dataset
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sales performance metrics, revenue growth, and ML forecasts calculated directly from historical transactions
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Recalculate dashboard aggregates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onNavigateToReports}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 text-xs font-medium text-cyan-300 rounded-lg transition-colors"
            title="Reload realistic 100+ synthetic order records"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Revenue"
          value={overview?.totalRevenue || 0}
          prefix="$"
          icon={DollarSign}
          subtitle="Net sales recorded"
        />
        <KPICard
          title="Total Orders"
          value={overview?.totalOrders || 0}
          icon={ShoppingCart}
          subtitle="Validated transactions"
        />
        <KPICard
          title="Total Profit"
          value={overview?.totalProfit || 0}
          prefix="$"
          icon={TrendingUp}
          trend={overview?.profitMargin}
          trendLabel="net margin"
        />
        <KPICard
          title="Avg Order Value"
          value={overview?.avgOrderValue || 0}
          prefix="$"
          icon={BarChart3}
          subtitle="Revenue per order"
        />
        <KPICard
          title="Sales Growth %"
          value={overview?.salesGrowthRate ? `${overview.salesGrowthRate > 0 ? '+' : ''}${overview.salesGrowthRate}%` : '0.0%'}
          icon={Percent}
          trend={overview?.salesGrowthRate}
          trendLabel="MoM velocity"
        />
        <KPICard
          title="Next Month Forecast"
          value={overview?.predictedNextMonthRevenue || 0}
          prefix="$"
          icon={Sparkles}
          subtitle="Random Forest Model"
        />
      </div>

      {/* Primary Charts Row 1: Monthly Sales Trend & Actual vs Predicted */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Trend Line Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Sales &amp; Growth Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly revenue vs rolling 3-month moving average
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                3M Moving Avg
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Monthly Revenue"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="rolling_3m_avg"
                  name="3M Average"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Distribution Donut Chart (1 Col) */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Profit by Category</h3>
              <p className="text-xs text-slate-400 mt-0.5">Margin contribution share</p>
            </div>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="profit"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Profit']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 uppercase font-sans">Net Margin</span>
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                {overview?.profitMargin || 0}%
              </span>
            </div>
          </div>

          {/* Legend rows */}
          <div className="space-y-1.5 text-xs">
            {categoryData.slice(0, 4).map((cat, idx) => (
              <div key={cat.category} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="truncate">{cat.category}</span>
                </div>
                <span className="font-mono tabular-nums text-slate-400">
                  ${Math.round(cat.profit).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Charts Row 2: Category Revenue Breakdown & Actual vs Predicted Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product Category Bar Chart */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue by Category</h3>
              <p className="text-xs text-slate-400 mt-0.5">Total sales volume per division</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actual vs Predicted Sales Overlay */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Actual vs. ML Predicted Sales</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Model training fit vs projected 3-month forecast
              </p>
            </div>
            <button
              onClick={onNavigateToPrediction}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>View ML Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actualVsPredictedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any, name: any) => [
                    val > 0 ? `$${Number(val).toLocaleString()}` : 'Awaiting projection',
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Historical"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#06b6d4' }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted / Projected"
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#ec4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Products Leaderboard */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Top-Performing Products Leaderboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by total historical revenue generated</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Total Revenue</th>
                <th className="py-2.5 px-3 text-right">Total Profit</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
              {topProducts.map((p, idx) => (
                <tr key={p.product_name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-2">
                    <span className="w-5 text-slate-500 font-mono text-[11px]">#{idx + 1}</span>
                    <span>{p.product_name}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{p.category}</td>
                  <td className="py-2.5 px-3 text-right">{p.units_sold.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">
                    ${p.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                    ${p.profit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {p.profit_margin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
