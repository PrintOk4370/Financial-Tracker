import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import '@aws-amplify/ui-react/styles.css'; // Add this for UI styles
import outputs from '../amplify_outputs.json';
import './CSS/App.css';
import AnalysisPage from './AnalysisPage.tsx';
import ForecastPage from './ForecastPage.tsx';
import SignUpPage from './SignUpPage.tsx'; // Import the new file


// Configure Amplify
Amplify.configure(outputs);
const client = generateClient();

type View = 'landing' | 'signup' | 'login' | 'dashboard';
type Tab = 'analysis' | 'forecast' | 'settings';


interface NavigationProps {
  onNavigate: (view: View) => void;
}

// --- Sub-Components (Authentication & Chat) ---

const LandingPage: React.FC<NavigationProps> = ({ onNavigate }) => (
  <div className="landing-page animate-enter">
    <div className="branding-icon" />
    <h1 className="hero-title">Master Your Wealth, Quietly.</h1>
    <p className="hero-subtitle">
      Finops provides military-grade cash flow analysis for the modern individual. 
      Secure. Private. Insightful.
    </p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button className="btn-primary" onClick={() => onNavigate('signup')}>Start Your Analysis</button>
      <button className="btn-ghost" onClick={() => onNavigate('login')}>Member Login</button>
    </div>
    <div className="security-footer">
      SECURE 256-BIT ENCRYPTION • PLAID INTEGRATED • BIO-LOCKED
    </div>
  </div>
);


// --- Main App Orchestrator ---

const App: React.FC = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('analysis');

  const handleSignOut = async () => {
  await signOut(); // This clears the session
  setView('landing'); // Send them back to the start
  };


  // If not authenticated, show landing/login
  if (!user && view !== 'landing' && view !== 'signup' && view !== 'login') {
    setView('landing');
  }

  // Dashboard header with user info
   const renderDashboardHeader = () => (
    <header className="dashboard-header">
      <div>
        <h1 style={{ margin: 0 }}>Welcome, {user?.signInDetails?.loginId || 'User'}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Your private financial dashboard</p>
      </div>
      <button onClick={handleSignOut} className="btn-ghost">
        Sign Out
      </button>
    </header>
  );


  if (view === 'landing') return <LandingPage onNavigate={setView} />;

    // --- CHANGE THIS SECTION ---
  if (view === 'signup') {
    return <SignUpPage onNavigate={setView} />;
  }


  // REPLACE your current login block:
  if (view === 'login') {
  return (
    <div className="auth-view animate-enter">
      <Authenticator>
        {({ user }) => {
          // This auto-redirects to dashboard once signed in
          if (user) {
            // Note: Side effects like setView should ideally be in a useEffect,
            // but this fragment fixes your immediate TS error.
            setView('dashboard');
          }
          return <></>; // Changed from null to fragment
        }}
      </Authenticator>
    </div>
  );
}



  return (
    <div style={{ display: 'flex' }}>
    {/* 1. Sidebar on the left */}
    <nav className="nav-sidebar">
      <div className="nav-logo-section">
        <div className="nav-logo-box" />
          FINOPS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className={`btn-ghost ${activeTab === 'analysis' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('analysis')}
            style={{
              textAlign: 'left',
              border: activeTab === 'analysis' ? 'none' : '1px solid transparent',
            }}
          >
            Analysis
          </button>
          <button
            className={`btn-ghost ${activeTab === 'forecast' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('forecast')}
            style={{
              textAlign: 'left',
              border: activeTab === 'forecast' ? 'none' : '1px solid transparent',
            }}
          >
            Forecast
          </button>
          <button
            className={`btn-ghost ${activeTab === 'settings' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{
              textAlign: 'left',
              border: activeTab === 'settings' ? 'none' : '1px solid transparent',
            }}
          >
            Settings
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            className="btn-ghost"
            onClick={() => setView('landing')}
            style={{ border: '1px solid rgba(255,255,255,0.1)', width: '100%' }}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* 2. Main content area on the right */}
    <main className="main-content" style={{ flex: 1, padding: '20px' }}>
      {/* Move Header here so it stays at the top of the main area */}
      {renderDashboardHeader()}

      {activeTab === 'analysis' && <AnalysisPage />}
      {activeTab === 'forecast' && <ForecastPage />}
      {activeTab === 'settings' && (
        <div className="animate-enter">
            <div className="card" style={{ marginTop: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Stealth Mode</div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Blur values in dashboard for privacy
                  </div>
                </div>
                <input type="checkbox" />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Dark Mode</div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Locked to 'On' for system integrity
                  </div>
                </div>
                <input type="checkbox" checked disabled />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* <ChatBot /> */}
    </div>
  );
};

// REPLACE your current export at the bottom:
export default function AppWithAuth() {
  return (
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  );
}
