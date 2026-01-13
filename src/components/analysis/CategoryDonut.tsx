import React from 'react';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import type { CategoryDonutProps } from '../types';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const CategoryDonut: React.FC<CategoryDonutProps> = ({ categoryData }) => {
  const data: ChartData<'doughnut'> = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,  // ✅ Pre-computed
        backgroundColor: ['#818CF8', '#FB7185', '#FBBF24', '#2DD4BF', '#9CA3AF', '#F59E0B'],
        borderWidth: 0,
        hoverOffset: 10
      },
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '75%',
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right' as const, 
        labels: { boxWidth: 10, color: '#9CA3AF', font: { size: 11 } } 
      }
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute', 
        top: '50%', 
        left: '35%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>TOTAL</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#F3F4F6' }}>
          ${categoryData.total.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonut;