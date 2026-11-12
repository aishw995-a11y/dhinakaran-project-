/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SalesProvider } from './contexts/SalesContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { UploadModal } from './components/common/UploadModal';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionPage } from './pages/PredictionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SalesDataPage } from './pages/SalesDataPage';
import { InsightsPage } from './pages/InsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // If on landing page, display landing page without sidebar
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <LandingPage
          onExploreDashboard={() => setCurrentView('dashboard')}
          onGoToAuth={() => setCurrentView('auth')}
        />
        <UploadModal />
      </div>
    );
  }

  // If on auth page
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <AuthPage onSuccess={() => setCurrentView('dashboard')} />
        <UploadModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 antialiased overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardPage
              onNavigateToPrediction={() => setCurrentView('prediction')}
              onNavigateToReports={() => setCurrentView('reports')}
            />
          )}
          {currentView === 'prediction' && <PredictionPage />}
          {currentView === 'analytics' && <AnalyticsPage />}
          {currentView === 'sales' && <SalesDataPage />}
          {currentView === 'insights' && <InsightsPage />}
          {currentView === 'reports' && <ReportsPage />}
          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global CSV Upload Modal */}
      <UploadModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <AppContent />
      </SalesProvider>
    </AuthProvider>
  );
}
