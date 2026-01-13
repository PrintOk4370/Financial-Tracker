import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import outputs from '../amplify_outputs.json';
import './css/App.css';

// Components
import LandingPage from './components/auth/LandingPage';
import NavSidebar from './components/layout/NavSidebar';
import DashboardHeader from './components/layout/DashboardHeader';
import AnalysisPage from './components/analysis/AnalysisPage';
import ForecastPage from './components/forecast/ForecastPage';
import SignUpPage from './components/auth/SignUpPage';

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
        {activeTab === 'settings' && (
          <div className="animate-enter" style={{ padding: '40px 20px' }}>
            <div className="card" style={{ maxWidth: '600px' }}>
              <h2>Settings</h2>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    Stealth Mode
                  </label>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                    Blur sensitive values for privacy
                  </span>
                  <input type="checkbox" id="stealth" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    Dark Mode
                  </label>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                    Always enabled for security
                  </span>
                  <input type="checkbox" id="dark" checked disabled />
                </div>
              </div>
            </div>
          </div>
        )}
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
