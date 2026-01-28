// components/forecast/ForecastChart.tsx
import React from 'react';
import { ForecastChartProps } from '../../types/index.ts';




const ForecastChart: React.FC<ForecastChartProps> = ({ lineData, riskFactor }) => {
  console.log('ForecastChart ', lineData.outflow); // DEBUG
  
  const points = lineData.outflow || [];
  if (points.length === 0) return <div>Loading forecast data...</div>;
  
  const maxPoint = Math.max(...points);
  const yMax = Math.ceil((maxPoint * 1.2) / 1000) * 1000;
  const yStep1 = Math.floor(yMax * 2 / 3);
  const yStep2 = Math.floor(yMax / 2);
  const yPos = (value: number) => 300 - (value / yMax * 250);
  
  console.log('Scale:', { yMax, yStep1, yStep2, maxPoint }); // DEBUG
  
  const spread = 20 + ((100 - riskFactor) * 1.5);
  const pathLine = points.map((p, i) => `${i * 100 + 50},${yPos(p)}`).join(' L ');
  const pathAreaTop = points.map((p, i) => `${i * 100 + 50},${yPos(p + i * spread * 0.5)}`).join(' L ');
  const pathAreaBottom = points.map((p, i) => `${i * 100 + 50},${yPos(p - i * spread * 0.5)}`).reverse().join(' L ');


  return (
    <div className="card" style={{ marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20 }}>
        <h3>30-Day Liquidity Forecast</h3>
        <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '0.85em', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2DD4BF' }}>
            <div style={{ width: '16px', height: '3px', background: '#2DD4BF', borderRadius: '2px' }}></div>
            <span>Actual Spend ($)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(45,212,191,0.8)' }}>
            <div style={{ width: '16px', height: '16px', background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.3)', borderRadius: '3px' }}></div>
            <span>Budget Bounds ($)</span>
          </div>
        </div>
      </div>
      
        <svg width="100%" height="300" viewBox="0 0 600 300" style={{ overflow: 'visible' }}>
          {/* Y-Axis */}
          {/* ✅ DYNAMIC Y-AXIS - Replace hardcoded section with this: */}
            <text x="25" y={yPos(yMax) + 5} fill="var(--text-muted)" fontSize="11" fontWeight="500">
              ${yMax.toLocaleString()}
            </text>
            <line x1="35" y1={yPos(yMax)} x2="45" y2={yPos(yMax)} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>

            <text x="25" y={yPos(yStep1) + 5} fill="var(--text-muted)" fontSize="11">
              ${yStep1.toLocaleString()}
            </text>
            <line x1="35" y1={yPos(yStep1)} x2="45" y2={yPos(yStep1)} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>

            <text x="25" y={yPos(yStep2) + 5} fill="var(--text-muted)" fontSize="11">
              ${yStep2.toLocaleString()}
            </text>
            <line x1="35" y1={yPos(yStep2)} x2="45" y2={yPos(yStep2)} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>


          {/* Data Points */}
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <text x={i * 100 + 50} y="285" fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                {lineData.labels[i] || `Day ${i + 1}`}
              </text>
              <text x={i * 100 + 70} y={295 - point} fill="#2DD4BF" fontSize="9" fontWeight="500" textAnchor="start">
                ${Math.round(point)}
              </text>
              <circle cx={i * 100 + 50} cy={300 - point} r="3" fill="#2DD4BF" stroke="white" strokeWidth="1.5"/>
            </g>
          ))}

          {/* Dynamic Grid */}
        <line x1="0" y1={yPos(yMax)} x2="600" y2={yPos(yMax)} stroke="rgba(255,255,255,0.1)" strokeDasharray="4,4" />
        <line x1="0" y1={yPos(yStep1)} x2="600" y2={yPos(yStep1)} stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
        <line x1="0" y1={yPos(yStep2)} x2="600" y2={yPos(yStep2)} stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
        
        {/* ✅ Dynamic Paths */}
        <path d={`M 50,${yPos(points[0])} L ${pathAreaTop} L ${pathAreaBottom} Z`} fill="rgba(45, 212, 191, 0.1)" stroke="rgba(45,212,191,0.3)" strokeWidth="1"/>
        <path d={`M 50,${yPos(points[0])} L ${pathLine}`} fill="none" stroke="var(--primary-teal)" strokeWidth="3" strokeLinecap="round"/>
        
        <line x1="300" y1="0" x2="300" y2="300" stroke="var(--text-muted)" strokeDasharray="5,5" />
        <text x="310" y="30" fill="var(--text-muted)" fontSize="12">Today</text>
      </svg>
    </div>
  );
};

export default ForecastChart;
