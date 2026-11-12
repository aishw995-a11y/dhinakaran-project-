import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Info,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import { PredictionResult } from '../types';
import { useSales } from '../contexts/SalesContext';

export const PredictionPage: React.FC = () => {
  const { dataVersion, refreshData } = useSales();
  const [selectedModel, setSelectedModel] = useState<string>('Random Forest Regressor');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('3m');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retraining, setRetraining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
  }, [selectedModel, selectedHorizon, dataVersion]);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getForecast(selectedModel, selectedHorizon);
      setPredictionResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate machine learning forecast');
    } finally {
      setLoading(false);
      setRetraining(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      setError(null);
      const res = await api.trainModel(selectedModel, selectedHorizon);
      setPredictionResult(res);
      refreshData();
    } catch (err: any) {
      setError(err.message || 'Model retraining failed');
    } finally {
      setRetraining(false);
    }
  };

  // Combine historical fitted points and future forecast points for the continuous curve
  const chartData = React.useMemo(() => {
    if (!predictionResult) return [];
    const combined: any[] = [];

    // Historical actuals & in-sample fitted
    if (predictionResult.historical_vs_fitted) {
      predictionResult.historical_vs_fitted.forEach((h) => {
        combined.push({
          period: h.period,
          actual: h.actual,
          fitted: h.predicted,
          forecast: null,
          lower_bound: null,
          upper_bound: null,
          type: h.is_test ? 'Held-Out Test' : 'Training Set',
        });
      });
    }

    // Future forecast step points
    if (predictionResult.forecast && predictionResult.forecast.length > 0) {
      // Connect last historical point
      const lastHist = predictionResult.historical_vs_fitted?.slice(-1)[0];
      if (lastHist) {
        combined.push({
          period: `${lastHist.period} (Latest)`,
          actual: lastHist.actual,
          fitted: lastHist.predicted,
          forecast: lastHist.predicted,
          lower_bound: lastHist.actual,
          upper_bound: lastHist.actual,
          type: 'Bridge',
        });
      }

      predictionResult.forecast.forEach((f) => {
        combined.push({
          period: f.period,
          actual: null,
          fitted: null,
          forecast: f.predicted_revenue,
          lower_bound: f.lower_bound,
          upper_bound: f.upper_bound,
          type: 'Future Forecast',
        });
      });
    }

    return combined;
  }, [predictionResult]);

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title & Pipeline Configuration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Sales Prediction Lab
            </h1>
            <span className="text-xs text-cyan-400 font-mono">
              Scikit-learn Regressors
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Strict chronological 80/20 train-test split prevents future lookahead leakage.
            Models ingest Lag features, rolling quarterly trends, and seasonal sine/cosine harmonics.
          </p>
        </div>

        {/* Configuration Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="Random Forest Regressor">Random Forest Regressor (Ensemble)</option>
              <option value="Linear Regression">Linear Regression (L2 Ridge)</option>
            </select>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedHorizon}
              onChange={(e) => setSelectedHorizon(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="7d">Next 7 Days</option>
              <option value="30d">Next 30 Days</option>
              <option value="3m">Next 3 Months</option>
              <option value="6m">Next 6 Months</option>
            </select>
          </div>

          {/* Retrain Button */}
          <button
            onClick={handleRetrain}
            disabled={retraining || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all shadow-sm shadow-blue-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Fitting Estimators...' : 'Retrain Pipeline'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Model Accuracy & Statistical Evaluation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Model Algorithm</div>
          <div className="text-sm font-bold text-white mt-1 truncate">
            {selectedModel === 'Linear Regression' ? 'Ridge Regression' : 'Random Forest'}
          </div>
          <div className="text-[10px] text-slate-300 mt-1">
            {selectedModel === 'Linear Regression' ? 'L2 Regularized' : '15 Decision Trees'}
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Mean Absolute Error</div>
          <div className="text-lg font-bold text-cyan-400 font-mono tabular-nums mt-1">
            ${predictionResult?.evaluation.mae.toLocaleString() || '0'}
          </div>
          <div className="text-[10px] text-slate-300 mt-1">MAE on test split</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Root Mean Squared</div>
          <div className="text-lg font-bold text-blue-400 font-mono tabular-nums mt-1">
            ${predictionResult?.evaluation.rmse.toLocaleString() || '0'}
          </div>
          <div className="text-[10px] text-slate-300 mt-1">RMSE penalty metric</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">R² Goodness of Fit</div>
          <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {predictionResult?.evaluation.r2 || '0.00'}
          </div>
          <div className="text-[10px] text-slate-300 mt-1">Variance explained (0 to 1)</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">MAPE Error %</div>
          <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
            {predictionResult?.evaluation.mape || '0'}%
          </div>
          <div className="text-[10px] text-slate-300 mt-1">Mean Absolute Percentage</div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Split Protocol</div>
          <div className="text-sm font-bold text-purple-400 font-mono mt-1">
            80% / 20%
          </div>
          <div className="text-[10px] text-slate-300 mt-1">
            {predictionResult?.evaluation.training_samples} train / {predictionResult?.evaluation.test_samples} test
          </div>
        </div>
      </div>

      {/* Main Machine Learning Forecast Chart with 95% Confidence Interval Band */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Autoregressive Sales Forecast &amp; Uncertainty Dispersion
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical actual sales vs in-sample model fit and recursive future projections with statistical 95% CI bands
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
              Actual Historical
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-0.5 bg-blue-400 inline-block" />
              Fitted Model
            </span>
            <span className="flex items-center gap-1.5 text-pink-400">
              <span className="w-2.5 h-0.5 bg-pink-400 inline-block" />
              Predicted Forecast
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 bg-indigo-500/20 border border-indigo-400 inline-block rounded-xs" />
              95% Confidence Range
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
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
                formatter={(value: any, name: any) => [
                  value ? `$${Math.round(Number(value)).toLocaleString()}` : '-',
                  name,
                ]}
              />
              {/* Confidence interval band */}
              <Area
                type="monotone"
                dataKey="upper_bound"
                name="Upper Bound (95% CI)"
                stroke="transparent"
                fill="url(#confidenceBand)"
              />
              <Area
                type="monotone"
                dataKey="lower_bound"
                name="Lower Bound (95% CI)"
                stroke="transparent"
                fill="#0f172a"
              />
              {/* Historical Line */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Revenue"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#06b6d4' }}
              />
              {/* In-sample fit Line */}
              <Line
                type="monotone"
                dataKey="fitted"
                name="Fitted Values"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
              {/* Forecast Line */}
              <Line
                type="monotone"
                dataKey="forecast"
                name="Future Forecast"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f43f5e' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Feature Importances & Predicted Horizon Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Ranking */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Feature Importance Ranking</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Gini impurity variance reduction computed across the tree ensemble
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {predictionResult?.feature_importances.map((item, idx) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.feature}</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {(item.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, item.importance * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Future Horizon Breakdown Table */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Forecast Horizon Projections</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-step autoregressive estimates with standard error bounds
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Forecast Step</th>
                  <th className="py-2.5 px-3 text-right">Predicted Revenue</th>
                  <th className="py-2.5 px-3 text-right">95% Range (Lower - Upper)</th>
                  <th className="py-2.5 px-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
                {predictionResult?.forecast.map((step) => (
                  <tr key={step.period} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{step.period}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-pink-400 font-bold text-sm">
                      ${step.predicted_revenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      ${step.lower_bound.toLocaleString()} - ${step.upper_bound.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {Math.round(step.confidence_level * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Viva Formulation Note */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>Academic Defense Insight</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Model inputs include recursive autoregression: ŷ(t) = f(y(t-1), y(t-2), y(t-3), MA3, sin(2πm/12), cos(2πm/12)).
              Dispersion increases proportionally with step horizon h: σ(h) = RMSE × √(1 + 0.25h).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
