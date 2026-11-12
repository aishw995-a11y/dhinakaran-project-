import React from 'react';
import { Menu, X, Upload, Sparkles, BarChart3, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSales } from '../../contexts/SalesContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { user, logout } = useAuth();
  const { setIsUploadModalOpen } = useSales();

  const isLanding = currentView === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-cyan-400 transition-colors">
              SalesPredict <span className="text-cyan-400 font-semibold">AI</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'dashboard' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('prediction')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'prediction' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            ML Prediction
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'analytics' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setCurrentView('sales')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'sales' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Dataset
          </button>
          <button
            onClick={() => setCurrentView('insights')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'insights' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            AI Insights
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Dataset
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => setCurrentView('settings')}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors"
                title={user.email}
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold overflow-hidden">
                  <img
                    src="/src/assets/images/avatar_lead_analyst_1794491090974.jpg"
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="hidden xl:inline max-w-[130px] truncate">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('auth')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
