import React from 'react';
import type { StatCardProps } from '../../types';


const StatCard: React.FC<StatCardProps> = ({ label, value, trend, isPositive }) => (
  <div className="card">
    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
      {label}
    </div>
    <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
      {value}
    </div>
    <div
      style={{
        color: isPositive ? 'var(--primary-teal)' : 'var(--alert-rose)',
        fontSize: '0.85rem',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      {isPositive ? '↑' : '↓'} {trend} vs last month
    </div>
  </div>
);

export default StatCard;
