import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart2,
  Database,
  Sparkles,
  FileText,
  Settings,
  HelpCircle,
  ExternalLink,
  UploadCloud,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useSales } from '../../contexts/SalesContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { setIsUploadModalOpen } = useSales();

  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'prediction', label: 'AI ML Prediction', icon: TrendingUp, badge: 'ML Lab' },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart2 },
    { id: 'sales', label: 'Sales Data Management', icon: Database },
    { id: 'insights', label: 'Strategic AI Insights', icon: Sparkles, badge: 'Gemini' },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Settings & Architecture', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-30 h-screen md:h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-800 bg-slate-950 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Mobile Header only */}
          <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-base font-bold text-white">SalesPredict AI</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Navigation
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] text-cyan-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Dataset Action */}
          <div className="pt-2">
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Dataset Actions
            </div>
            <button
              onClick={() => {
                setIsUploadModalOpen(true);
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-lg transition-colors border border-dashed border-slate-800 hover:border-slate-700"
            >
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Import New CSV</span>
            </button>
          </div>

          {/* Academic Project Reference */}
          <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>B.Tech AI &amp; DS Project</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Equipped with Linear Regression, Random Forest Regressor, and time-based train/test splits.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-300 font-mono">
              <span>Status: Verified</span>
              <span>v1.0</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'landing'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Landing Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 pt-1 text-[11px] text-slate-300 flex justify-between">
            <span>SalesPredict AI</span>
            <span>2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};
