import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Cpu,
  Database,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Download,
  CheckCircle2,
  Layers,
  Code2,
} from 'lucide-react';
import { useSales } from '../contexts/SalesContext';

interface LandingPageProps {
  onExploreDashboard: () => void;
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDashboard,
  onGoToAuth,
}) => {
  const { setIsUploadModalOpen } = useSales();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-800/80 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>B.Tech AI &amp; Data Science Academic Project</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Predict Smarter. Analyze Better.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Grow Faster.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              SalesPredict AI is a full-stack sales prediction and business analytics system.
              Harnessing scikit-learn machine learning pipelines (Linear Regression &amp; Random Forest),
              time-series autoregression, and Gemini AI strategic advisory to transform raw transactional data into predictive revenue forecasts.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onExploreDashboard}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 group"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Upload Sales Dataset</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Temporal Leakage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Chronological 80/20 Split</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>MAE, RMSE, R² Evaluated</span>
              </div>
            </div>
          </div>

          {/* Interactive Workspace Graphic */}
          <div className="mt-12 sm:mt-16 relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-sm overflow-hidden group">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src="/src/assets/images/sales_predict_hero_1794491090516.jpg"
                alt="SalesPredict AI Machine Learning & Business Analytics Console"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md">
                <div>
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                    Real Machine Learning Engine Active
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Multivariate Autoregressive Lag Analysis with Seasonal Harmonics
                  </div>
                </div>
                <button
                  onClick={onExploreDashboard}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  Launch Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise Data Architecture &amp; ML Pipeline
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Engineered to meet academic rigors and commercial standard practices in data science and full-stack software development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Dual ML Model Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare baseline regularized Linear Regression against ensemble Random Forest Regressor models with bagging and bootstrap variance reduction.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Time-Series Feature Engineering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts Lag-1, Lag-2, Lag-3 revenue, rolling 3-month &amp; 6-month moving averages, seasonal trigonometric waves (sin/cos), and linear growth indices.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Multidimensional Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive Recharts dashboards exploring monthly revenue trends, product category profitability, margin percentages, and regional performance.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Automated Data Hygiene</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag-and-drop CSV ingestion pipeline that handles duplicate order IDs, validates data types, and computes revenue and profit automatically.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Gemini Strategic Advisory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict numerical grounding: feeds computed dataset facts directly into Gemini 3.8 Flash to synthesize executive business recommendations without hallucinations.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Statistical Confidence Bounds</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Forecast graphs display authentic 95% confidence intervals based on residual standard errors with time horizon dispersion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / ML Methodology */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Machine Learning Pipeline Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From raw order transactions to rigorous machine learning evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
              <div className="text-2xl font-bold text-cyan-400 font-mono">01</div>
              <h4 className="text-sm font-semibold text-white">Data Ingestion &amp; Hygiene</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                CSV parser validates columns, fills missing revenue/cost fields, resolves duplicate keys, and computes data hygiene score.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
              <div className="text-2xl font-bold text-cyan-400 font-mono">02</div>
              <h4 className="text-sm font-semibold text-white">Feature Engineering</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates lag terms (t-1, t-2, t-3), rolling quarterly metrics, seasonality coordinates sin(2πm/12), cos(2πm/12), and trend coefficients.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
              <div className="text-2xl font-bold text-cyan-400 font-mono">03</div>
              <h4 className="text-sm font-semibold text-white">Chronological Split</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies an 80/20 train/test split strictly based on time order. Guarantees testing is on true future periods to prevent data leakage.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
              <div className="text-2xl font-bold text-cyan-400 font-mono">04</div>
              <h4 className="text-sm font-semibold text-white">Evaluation &amp; Forecasting</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes actual MAE, RMSE, R², and MAPE scores, then renders recursive autoregressive forecasts with 95% confidence intervals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Code2 className="w-4 h-4" />
                <span>Full-Stack &amp; Python Backend Integration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Ready for Academic Review &amp; Production Deployment
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Complete codebase includes Python FastAPI microservices, SQLite persistence, Scikit-learn regressors, Express unified server, and modern React 19 UI.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={onExploreDashboard}
                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-400/20"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SalesPredict AI</span>
            <span>·</span>
            <span>Third-Year B.Tech AI &amp; Data Science Academic Project</span>
          </div>
          <div>
            Built with Scikit-learn, React 19, Recharts &amp; Gemini 3.8 Flash
          </div>
        </div>
      </footer>
    </div>
  );
};
