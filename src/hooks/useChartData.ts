import { useMemo } from 'react';
import type { Transaction } from '../types';

export const useChartData = (transactions: Transaction[]) => {
  // 1. Category Donut Data
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      const cat = t.category || 'Other';
      totals[cat] = (totals[cat] || 0) + t.amount;
    });
    return {
      labels: Object.keys(totals),
      values: Object.values(totals),
      total: Object.values(totals).reduce((sum, v) => sum + v, 0),
    };
  }, [transactions]);

  // 2. IncomeVsExpense Line Data
  const lineData = useMemo(() => {
    const monthly: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.expenseDate) {
        const month = new Date(t.expenseDate).toLocaleDateString('en-US', { month: 'short' });
        monthly[month] = (monthly[month] || 0) + t.amount;
      }
    });
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const outflow = labels.map(m => Math.round(monthly[m] || 0));
    return {
      labels,
      outflow,
      inflow: outflow.map(d => d * 1.6),  // Mock - query FixedCost for real
    };
  }, [transactions]);

  // 3. Budget Gauge Data
  const budgetData = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      current: totalSpent,
      limit: 5000,  // Configurable
      percentage: Math.min((totalSpent / 5000) * 100, 100),
    };
  }, [transactions]);

  // 4. Net Liquidity
  const netLiquidity = useMemo(() => 
    transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]
  );

  return {
    category: categoryData,
    line: lineData,
    budget: budgetData,
    netLiquidity,
  };
};
