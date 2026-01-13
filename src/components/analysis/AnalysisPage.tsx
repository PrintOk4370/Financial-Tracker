import React, { useState } from 'react';

import AddTransactionModal from '../AddTransaction/AddTransactionModal.tsx';
import { useTransactions } from '../../hooks/useTransaction.ts'; 
import { useChartData } from '../../hooks/useChartData.ts'; 
import BudgetGauge from '../analysis/BudgetGauge.tsx';
import SpendingHeatmap from '../analysis/SpendingHeatMap.tsx';
import SankeyFlow from '../analysis/SankeyFlow';
import StatCard from '../analysis/StatCard';
import IncomeVsExpenseChart from '../analysis/IncomeVsExpenseChart';
import CategoryDonut from '../analysis/CategoryDonut';


const AnalysisPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // ✅ Hook handles fetching, auth, and real-time sync
  const { transactions, loading } = useTransactions();
  
  // ✅ useChartData processes raw transactions into chart-ready formats
  const chartData = useChartData(transactions);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        Initializing Live Data...
      </div>
    );
  }

  return (
    <div className="animate-enter" style={{ position: 'relative', padding: '20px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0 }}>Cash Flow Audit</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time liquidity tracking</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: '2rem', color: 'var(--primary-teal)' }}>
            ${chartData.netLiquidity.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NET LIQUIDITY</div>
        </div>
      </header>

      {/* Primary Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ height: '320px' }}>
          <h3 style={{ marginBottom: '20px' }}>Inflow vs Outflow</h3>
          <div style={{ height: '240px' }}>
            <IncomeVsExpenseChart lineData={chartData.line} />
          </div>
        </div>
        <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '10px', width: '100%' }}>Budget Limit</h3>
          <BudgetGauge current={chartData.budget.current} limit={chartData.budget.limit} />
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ height: '300px' }}>
          <h3 style={{ marginBottom: '20px' }}>The River of Money</h3>
          <SankeyFlow transactions={transactions} budget={5000}  />     //change this static budget later
        </div>
        <div className="card" style={{ height: '300px' }}>
          <h3 style={{ marginBottom: '10px' }}>Category Breakdown</h3>
          <div style={{ height: '220px' }}>
            <CategoryDonut categoryData={chartData.category} />
          </div>
        </div>
      </div>

      

      {/* Heatmap Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Spending Intensity</h3>
        <SpendingHeatmap transactions={transactions} />
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fab"
        style={{
          position: 'fixed', bottom: '40px', right: '40px', width: '60px', height: '60px',
          borderRadius: '50%', background: 'var(--primary-teal)', border: 'none', color: 'black',
          fontSize: '2rem', cursor: 'pointer', zIndex: 100, boxShadow: '0 4px 20px rgba(45, 212, 191, 0.4)'
        }}
      >
        +
      </button>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default AnalysisPage;
