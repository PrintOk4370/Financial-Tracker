import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import type { BudgetGaugeProps } from '../../types/index.ts';


ChartJS.register(ArcElement, Tooltip, Legend);


const BudgetGauge: React.FC<BudgetGaugeProps> = ({ current, limit }) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isDanger = percentage > 85;

  const data: ChartData<'doughnut'> = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [current, Math.max(0, limit - current)],
        backgroundColor: [isDanger ? '#FB7185' : '#2DD4BF', 'rgba(255,255,255,0.05)'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270, 
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '85%',
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: false }, legend: { display: false } }
  };

  return (
    <div style={{ position: 'relative', height: '150px', width: '100%' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{Math.round(percentage)}%</div>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Used</div>
      </div>
    </div>
  );
};

export default BudgetGauge;
