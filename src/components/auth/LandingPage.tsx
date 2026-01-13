

import type { View } from '../../types';  // Adjust path as necessary

interface NavigationProps {
  onNavigate: (view: View) => void;
}

const LandingPage: React.FC<NavigationProps> = ({ onNavigate }) => (
  <div className="landing-page animate-enter">
    <div className="branding-icon" />
    <h1 className="hero-title">Master Your Wealth, Quietly.</h1>
    <p className="hero-subtitle">Finops provides military-grade cash flow analysis...</p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button className="btn-primary" onClick={() => onNavigate('signup')}>Start</button>
      <button className="btn-ghost" onClick={() => onNavigate('login')}>Login</button>
    </div>
    <div className="security-footer">SECURE 256-BIT ENCRYPTION...</div>
  </div>
);

export default LandingPage;