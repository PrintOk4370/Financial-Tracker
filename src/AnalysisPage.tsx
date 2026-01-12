import React, { useState } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import AddTransactionModal from './AddTransactionModal.tsx';


// --- Types ---
interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
}

interface BudgetGaugeProps {
  current: number;
  limit: number;
}

interface Transaction {
  // Define based on your backend schema
  amount: number | String;
  category?: string;
  date?: string;
  description?: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactions: Transaction[]) => void;
}

// --- Chart.js Registration ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Global Chart Defaults
ChartJS.defaults.color = '#9CA3AF';
ChartJS.defaults.font.family = 'Inter';
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.05)';

// --- Sub-Components ---

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

const IncomeVsExpenseChart: React.FC = () => {
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

  const data: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [  // <- Fixed: use "datasets" property
      {
        label: 'Inflow',
        data:[5000, 5200, 5100, 5800, 6200, 6400],  // <- Fixed: "data" property
        borderColor: '#2DD4BF',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        fill: true,
      },
      {
        label: 'Outflow',
        data: [3000, 3500, 2800, 4200, 3800, 4100],  // <- Fixed: "data" property
        borderColor: '#FB7185',
        backgroundColor: 'transparent',
        borderDash: [5, 5], 
      },
    ],
  };

  return <Line options={options} data={data} />;
};


const CategoryDonut: React.FC = () => {
  const data: ChartData<'doughnut'> = {
    labels: ['Housing', 'Food', 'Transport', 'Savings', 'Ent.'],
    datasets: [  // <- Fixed: use "datasets" property
      {
        data: [35, 20, 10, 25, 10],  // <- Fixed: "data" property
        backgroundColor: ['#818CF8', '#FB7185', '#FBBF24', '#2DD4BF', '#9CA3AF'],
        borderWidth: 0,
        hoverOffset: 10
      },
    ]
  };

  const options: ChartOptions<'doughnut'> = {  // <- Fixed: ChartOptions not ChartJS.ChartOptions
    cutout: '75%',
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { boxWidth: 10, color: '#9CA3AF', font: {size: 11} } }
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute', top: '50%', left: '35%', transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>TOTAL</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#F3F4F6' }}>$4.2k</div>
      </div>
    </div>
  );
};


const BudgetGauge: React.FC<BudgetGaugeProps> = ({ current, limit }) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isDanger = percentage > 85;

  const data: ChartData<'doughnut'> = {
    labels: ['Spent', 'Remaining'],
    datasets: [  // <- Fixed: use "datasets" property
      {
        data:[current, limit - current],  // <- Fixed: "data" property
        backgroundColor: [isDanger ? '#FB7185' : '#2DD4BF', 'rgba(255,255,255,0.05)'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270, 
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {  // <- Fixed: ChartOptions not ChartJS.ChartOptions
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
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(percentage)}%</div>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Used</div>
      </div>
    </div>
  );
};

interface HeatmapDay {
  value: number;
  date: string;
}

const SpendingHeatmap: React.FC = () => {
  const today = new Date();
  const getPastDate = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weeks: HeatmapDay[][] = [4, 3, 2, 1, 0].map(weekOffset => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const totalDaysAgo = (weekOffset * 7) + (6 - dayIndex);
      return {
        value: Math.floor(Math.random() * 4),
        date: getPastDate(totalDaysAgo),
      };
    });
  });

  const getColor = (val: number): string => {
    if (val === 0) return 'rgba(255,255,255,0.05)';
    if (val === 1) return 'rgba(45, 212, 191, 0.2)';
    if (val === 2) return 'rgba(45, 212, 191, 0.5)';
    return '#2DD4BF';
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: '4px',
          paddingTop: '2px',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          opacity: 0.6,
        }}
      >
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {weeks.map((week, wIndex) => (
          <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {week.map((day, dIndex) => (
              <div
                key={dIndex}
                title={`${day.date}: Level ${day.value}`}
                style={{
                  flex: 1,
                  borderRadius: '4px',
                  backgroundColor: getColor(day.value),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.target as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const SankeyFlow: React.FC = () => {
  return (
    <svg width="100%" height="200" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect x="0" y="80" width="10" height="40" rx="4" fill="#2DD4BF" />
      <text x="0" y="70" fill="#9CA3AF" fontSize="10">Income</text>
      <rect x="390" y="20" width="10" height="60" rx="4" fill="#818CF8" />
      <text x="360" y="15" fill="#9CA3AF" fontSize="10">Needs</text>
      <rect x="390" y="100" width="10" height="40" rx="4" fill="#FB7185" />
      <text x="360" y="150" fill="#9CA3AF" fontSize="10">Wants</text>
      <rect x="390" y="160" width="10" height="20" rx="4" fill="#2DD4BF" />
      <text x="360" y="190" fill="#9CA3AF" fontSize="10">Save</text>
      <path
        d="M 10 100 C 200 100, 200 50, 390 50"
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="15"
        opacity="0.4"
        className="sankey-link"
      />
      <path
        d="M 10 100 C 200 100, 200 120, 390 120"
        fill="none"
        stroke="#FB7185"
        strokeWidth="10"
        opacity="0.3"
        className="sankey-link"
      />
      <path
        d="M 10 100 C 200 100, 200 170, 390 170"
        fill="none"
        stroke="#2DD4BF"
        strokeWidth="5"
        opacity="0.3"
        className="sankey-link"
      />
    </svg>
  );
};

// --- Main Export ---
const AnalysisPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleNewTransactions = (transactions: Transaction[]): void => {
    // In a real app, this is where you'd merge the new data
    // into your chart datasets or refresh the data from the backend.
    console.log('Adding new transactions to database:', transactions);
    alert(`Successfully processed ${transactions.length} transactions.`);
  };

  return (
    <div className="animate-enter" style={{ position: 'relative' }}>
      <header
        style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Cash Flow Audit</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time liquidity tracking</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: '2rem', color: 'var(--primary-teal)' }}>
            $2,450.00
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NET LIQUIDITY</div>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        <div className="card" style={{ height: '320px' }}>
          <h3 style={{ marginBottom: '20px' }}>Inflow vs Outflow</h3>
          <div style={{ height: '240px' }}>
            <IncomeVsExpenseChart />
          </div>
        </div>
        <div
          className="card"
          style={{
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ marginBottom: '10px', width: '100%' }}>Budget Limit</h3>
          <BudgetGauge current={2100} limit={2800} />
          <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--alert-rose)' }}>$2,100</span> / $2,800
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        <div className="card" style={{ height: '300px' }}>
          <h3 style={{ marginBottom: '20px' }}>The River of Money</h3>
          <SankeyFlow />
        </div>
        <div className="card" style={{ height: '300px' }}>
          <h3 style={{ marginBottom: '10px' }}>Category Breakdown</h3>
          <div style={{ height: '220px' }}>
            <CategoryDonut />
          </div>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h3>Spending Intensity</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 35 Days</div>
        </div>
        <SpendingHeatmap />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>5 Weeks Ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed' as const,
          bottom: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary-teal)',
          color: 'var(--bg-deep)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(45, 212, 191, 0.4)',
          fontSize: '2rem',
          cursor: 'pointer',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1.0)';
        }}
        title="Add Expense"
      >
        +
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNewTransactions}
      />
    </div>
  );
};

export default AnalysisPage;
