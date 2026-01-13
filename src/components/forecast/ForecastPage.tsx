import React, { useState } from 'react';

const ForecastPage: React.FC = () => {
  const [riskFactor, setRiskFactor] = useState<number>(50); 
  
  // Logic: Lower Risk (Conservative) = Wider Cone. Higher Risk (Aggressive) = Narrower Cone.
  const spread = 20 + ((100 - riskFactor) * 1.5); 
  
  const points: number[] = [100, 120, 115, 140, 135, 160, 150]; 
  const pathLine: string = points.map((p, i) => `${i * 100},${300 - p}`).join(' L ');
  const pathAreaTop: string = points.map((p, i) => `${i * 100},${300 - (p + (i * spread * 0.5))}`).join(' L ');
  const pathAreaBottom: string = points.map((p, i) => `${i * 100},${300 - (p - (i * spread * 0.5))}`).reverse().join(' L ');

  return (
    <div className="animate-enter">
      <h1 style={{ marginBottom: '10px' }}>Predictive Modeling</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
        Adjust the algorithm's sensitivity to market variance.
      </p>

      <div className="card" style={{ marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ position: 'absolute', top: 20, left: 20 }}>30-Day Liquidity Forecast</h3>
        <svg width="100%" height="300" viewBox="0 0 600 300" style={{ overflow: 'visible' }}>
          <line x1="0" y1="250" x2="600" y2="250" stroke="rgba(255,255,255,0.1)" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.1)" />
          <path 
            d={`M 0,${300-points[0]} L ${pathAreaTop} L ${pathAreaBottom} Z`} 
            fill="rgba(45, 212, 191, 0.1)" 
            stroke="none"
          />
          <path d={`M ${pathLine}`} fill="none" stroke="var(--primary-teal)" strokeWidth="3" />
          <line x1="300" y1="0" x2="300" y2="300" stroke="var(--text-muted)" strokeDasharray="5,5" />
          <text x="310" y="30" fill="var(--text-muted)" fontSize="12">Projection Start</text>
        </svg>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Conservative (High Error Margin)</span>
          <span style={{ color: 'var(--primary-teal)' }}>Aggressive (Low Error Margin)</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={riskFactor} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskFactor(Number(e.target.value))} 
        />
        <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
          Risk Factor: <span className="mono">{riskFactor}%</span> —{' '}
          {riskFactor < 30 
            ? " Assuming heavy unexpected expenses." 
            : riskFactor > 70 
            ? " Assuming perfect budget adherence." 
            : " Balanced outlook."
          }
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
