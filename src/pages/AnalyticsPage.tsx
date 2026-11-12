import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  Globe,
  Tag,
  Package,
  Layers,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { api } from '../services/api';
import { useSales } from '../contexts/SalesContext';
import {
  CategorySalesPoint,
  RegionSalesPoint,
  ProductPerformance,
  MonthlySalesPoint,
} from '../types';

const COLORS = ['#06b6d4', '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export const AnalyticsPage: React.FC = () => {
  const { dataVersion } = useSales();
  const [categories, setCategories] = useState<CategorySalesPoint[]>([]);
  const [regions, setRegions] = useState<RegionSalesPoint[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [lowProducts, setLowProducts] = useState<ProductPerformance[]>([]);
  const [monthly, setMonthly] = useState<MonthlySalesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dataVersion]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [catRes, regRes, prodRes, monthRes] = await Promise.all([
        api.getCategoryAnalytics(),
        api.getRegionAnalytics(),
        api.getProductAnalytics(10),
        api.getMonthlyAnalytics(),
      ]);

      setCategories(catRes);
      setRegions(regRes);
      setTopProducts(prodRes.topProducts);
      setLowProducts(prodRes.lowProducts);
      setMonthly(monthRes);
    } catch (err) {
      console.error('Failed to load deep analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);
  const totalProfit = categories.reduce((sum, c) => sum + c.profit, 0);
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Multidimensional Business Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive revenue streams, product unit economics, regional territory distribution, and gross margins
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-slate-400 mr-2">Aggregate Margin:</span>
            <span className="text-emerald-400 font-bold">{overallMargin}%</span>
          </div>
        </div>
      </div>

      {/* Row 1: Category Economics & Profit Margin Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Category Revenue vs. Cost Structure</h3>
            <p className="text-xs text-slate-400 mt-0.5">Stacked breakdown of net revenue and COGS expenses</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="cost" name="Cost of Goods (COGS)" fill="#64748b" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Performance Distribution */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Geographic Territory Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sales contribution and profit margin by sales region</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <YAxis
                  dataKey="region"
                  type="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]}>
                  {regions.map((entry, index) => (
                    <Cell key={`reg-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Performance Matrix: Best vs Attention Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Best-Selling Products */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">High-Velocity Best Sellers</h3>
          </div>

          <div className="space-y-3">
            {topProducts.slice(0, 5).map((p, idx) => (
              <div
                key={p.product_name}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-mono text-xs font-bold text-cyan-400">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-white">{p.product_name}</div>
                    <div className="text-[11px] text-slate-400">{p.category}</div>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-bold text-cyan-400">${p.revenue.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400">{p.profit_margin}% margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low-Performing Products Requiring Strategy Attention */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Underperforming Catalog Products</h3>
          </div>

          <div className="space-y-3">
            {lowProducts.slice(0, 5).map((p) => (
              <div
                key={p.product_name}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-white">{p.product_name}</div>
                  <div className="text-[11px] text-slate-400">{p.category} · {p.units_sold} units sold</div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-bold text-slate-300">${p.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-amber-400 font-sans">Attention Recommended</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
