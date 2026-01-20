import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import outputs from '../amplify_outputs.json';
import './css/base.css';
import './css/components.css';
import './css/layout.css';
import './css/nav.css'
import './css/pages.css'
// Components
import LandingPage from './components/auth/LandingPage';
import NavSidebar from './components/layout/NavSidebar';
import DashboardHeader from './components/layout/DashboardHeader';
import AnalysisPage from './components/analysis/AnalysisPage';
import ForecastPage from './components/forecast/ForecastPage';
import SignUpPage from './components/auth/SignUpPage';
import SettingsTab from './components/settings.tsx';
import ExpensesTab from './components/ExpensesPage.tsx';
// Types
import type { View, Tab } from './types';

Amplify.configure(outputs);

const AppContent: React.FC = () => {
  const { user, signOut } = useAuthenticator((c) => [c.user]);
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('analysis');

  const handleLogout = async () => {
    await signOut();
    setView('landing');
  };

  // Auto-redirect after login (useEffect fixes side-effect warning)
  useEffect(() => {
    if (user && view !== 'dashboard') {
      setView('dashboard');
    }
  }, [user, view]);

  // Landing
  if (view === 'landing') {
    return <LandingPage onNavigate={setView} />;
  }

  // Custom signup
  if (view === 'signup') {
    return <SignUpPage onNavigate={setView} />;
  }

  // Authenticator login screen
  if (view === 'login') {
    return (
      <div className="auth-view animate-enter">
        <Authenticator />
      </div>
    );
  }

  // Dashboard (authenticated)
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <NavSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="main-content" style={{ flex: 1 }}>
        <DashboardHeader 
          userEmail={user?.signInDetails?.loginId || 'User'}
          onSignOut={handleLogout}
        />

        {/* Tab content */}
        {activeTab === 'analysis' && <AnalysisPage />}
        {activeTab === 'forecast' && <ForecastPage />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'expenses' && <ExpensesTab />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Authenticator.Provider>
      <AppContent />
    </Authenticator.Provider>
  );
}
