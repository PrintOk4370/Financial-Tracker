import React from 'react';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { IncomeVsExpenseProps } from '../types/index.ts';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);



const IncomeVsExpenseChart: React.FC<IncomeVsExpenseProps> = ({ lineData }) => {
  const data: ChartData<'line'> = {
    labels: lineData.labels,
    datasets: [
      {
        label: 'Inflow',
        data: lineData.inflow,  // ✅ Pre-computed
        borderColor: '#2DD4BF',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        fill: true,
      },
      {
        label: 'Outflow',
        data: lineData.outflow,  // ✅ Pre-computed
        borderColor: '#FB7185',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { usePointStyle: true, boxWidth: 6, color: '#9CA3AF' } },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: '#151E32',
        titleColor: '#F3F4F6',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      },
    },
    scales: {
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { font: { family: 'JetBrains Mono' } }
      },
      x: { grid: { display: false } }
    },
    elements: {
      line: { tension: 0.4 }
    }
  };

  return <Line options={options} data={data} />;
};


export default IncomeVsExpenseChart;
