import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Code2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSales } from '../contexts/SalesContext';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();
  const { refreshData } = useSales();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess(null);
    setPwdError(null);

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }

    setPwdLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPwdSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await api.resetDemoData();
      setActionMessage(res.message);
      refreshData();
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to reload demo data');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurgeData = async () => {
    if (window.confirm('Are you sure you want to delete all your sales transactions?')) {
      setActionLoading(true);
      setActionMessage(null);
      try {
        const res = await api.clearAllData();
        setActionMessage(res.message);
        refreshData();
      } catch (err: any) {
        setActionMessage(err.message || 'Failed to purge data');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          System Settings &amp; Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage user profile credentials, dataset lifecycle, and review academic ML project specifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Password */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Analyst Profile</h3>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-cyan-500/50 overflow-hidden shrink-0">
                <img
                  src="/src/assets/images/avatar_lead_analyst_1794491090974.jpg"
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{user?.name}</div>
                <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-0.5">Role: Lead Data Scientist</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-slate-300">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Access Scope:</span>
                <span className="text-emerald-400">Full Dashboard &amp; ML Lab</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Change Password Card */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Security &amp; Password</h3>

            {pwdSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{pwdSuccess}</span>
              </div>
            )}
            {pwdError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Database Management & Academic Viva Reference */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Management Card */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Database Lifecycle &amp; Persistence</h3>
            </div>
            <p className="text-xs text-slate-400">
              Transactions are stored in an embedded SQLite database (`salespredict.db`) with indexes on `user_id` and `order_date`.
            </p>

            {actionMessage && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{actionMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleResetDemo}
                disabled={actionLoading}
                className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-left space-y-1 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-cyan-400">
                  <span>Reload Synthetic Demo Dataset</span>
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Restores 104 realistic multi-quarter transactions across all product divisions.
                </p>
              </button>

              <button
                onClick={handlePurgeData}
                disabled={actionLoading}
                className="p-4 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 rounded-xl text-left space-y-1 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span>Purge All Records</span>
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-[11px] text-rose-300/80">
                  Deletes all sales transactions and prediction logs for this user account.
                </p>
              </button>
            </div>
          </div>

          {/* Academic Viva Defense Notes */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">
                B.Tech AI &amp; Data Science Viva Examination Guide
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <span className="font-semibold text-white font-mono text-[11px]">
                  1. Zero Temporal Look-Ahead Leakage Protocol
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Unlike traditional random k-fold cross-validation which randomly mixes past and future records, SalesPredict AI enforces a strict chronological 80/20 train-test split. The model is trained strictly on historical observations (t ≤ T_split) and evaluated on unseen future periods (t &gt; T_split).
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <span className="font-semibold text-white font-mono text-[11px]">
                  2. Feature Engineering Equations
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed font-mono">
                  • Lag Features: Lag1 = y(t-1), Lag2 = y(t-2), Lag3 = y(t-3)<br />
                  • Rolling Quarter: Roll3M = (1/3) × ∑ y(t-i)<br />
                  • Seasonal Coordinates: sin(2πm / 12), cos(2πm / 12)
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <span className="font-semibold text-white font-mono text-[11px]">
                  3. Model Evaluation Formulations
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed font-mono">
                  • MAE = (1/n) × ∑ |y_i - ŷ_i|<br />
                  • RMSE = √((1/n) × ∑ (y_i - ŷ_i)²)<br />
                  • R² = 1 - (∑(y_i - ŷ_i)² / ∑(y_i - ȳ)²)<br />
                  • MAPE = (100% / n) × ∑ |(y_i - ŷ_i) / y_i|
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <span className="font-semibold text-white font-mono text-[11px]">
                  4. Grounded AI Strategy Integration (Gemini 3.8 Flash)
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The LLM acts as an executive synthesis layer, receiving exact computed analytics (top revenue product, gross margin %, regional revenue, predicted volume). Numerical hallucination is banned through prompt constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
