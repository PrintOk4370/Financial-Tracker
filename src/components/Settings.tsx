// components/SettingsTab.tsx

import React from 'react';

const SettingsTab: React.FC = () => {
  return (
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
  );
};
export default SettingsTab;