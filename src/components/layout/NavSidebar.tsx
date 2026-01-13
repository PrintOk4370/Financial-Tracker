import type { Tab } from '../../types/index.ts';

interface NavSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const NavSidebar: React.FC<NavSidebarProps> = ({ activeTab, onTabChange, onLogout }) => (
  <nav className="nav-sidebar">
    <div className="nav-logo-section">
      <div className="nav-logo-box" /> FINOPS
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button className={`btn-ghost ${activeTab === 'analysis' ? 'btn-primary' : ''}`} onClick={() => onTabChange('analysis')}>
        Analysis
      </button>
      <button className={`btn-ghost ${activeTab === 'forecast' ? 'btn-primary' : ''}`} onClick={() => onTabChange('forecast')}>
        Forecast
      </button>
      <button className={`btn-ghost ${activeTab === 'settings' ? 'btn-primary' : ''}`} onClick={() => onTabChange('settings')}>
        Settings
      </button>
    </div>
    
    <button className="btn-ghost" onClick={onLogout} style={{ marginTop: 'auto', width: '100%' }}>
      Log Out
    </button>
  </nav>
);

export default NavSidebar;
