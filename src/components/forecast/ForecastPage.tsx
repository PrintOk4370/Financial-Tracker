// components/forecast/ForecastContainer.tsx
import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransaction';
import { useChartData } from '../../hooks/useChartData';
import ForecastChart from './ForcastChart.tsx';

const ForecastPage: React.FC = () => {
  const { transactions } = useTransactions();
  const chartData = useChartData(transactions);
  const [riskFactor, setRiskFactor] = useState<number>(50);

  const forecastData = {
    labels: chartData.line.labels.slice(0,12),
    outflow: chartData.line.outflow.slice(0,12)
  };

  return (
    <div className="animate-enter">
      <h1 style={{ marginBottom: '10px' }}>Predictive Modeling</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
        Adjust the algorithm's sensitivity to market variance.
      </p>

      <ForecastChart 
        lineData={forecastData}
        riskFactor={riskFactor}
        onRiskFactorChange={setRiskFactor}
      />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Conservative</span>
          <span style={{ color: 'var(--primary-teal)' }}>Aggressive</span>
        </div>
        <input 
          type="range" 
          min="0"   
          max="100" 
          value={riskFactor} 
          onChange={(e) => setRiskFactor(Number(e.target.value))} 
        />
        <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
          Risk Factor: <span className="mono">{riskFactor}%</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
