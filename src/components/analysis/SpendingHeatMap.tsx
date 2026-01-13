// src/components/charts/SpendingHeatmap.tsx
import React from 'react';
import type { Transaction } from '../types/index.ts';
import type { HeatmapDay } from '../types/index.ts';

interface SpendingHeatmapProps {
  transactions: Transaction[];
}


const SpendingHeatmap: React.FC<SpendingHeatmapProps> = ({ transactions }) => {
  const today = new Date();
  
  // Get spending data for last 35 days (5 weeks)
  const getHeatData = () => {
    const thirtyFiveDaysAgo = new Date(today);
    thirtyFiveDaysAgo.setDate(today.getDate() - 35);
    
    const dailyTotals: Record<string, number> = {};
    
    transactions.forEach(t => {
      const txnDate = new Date(t.expenseDate);
      if (txnDate >= thirtyFiveDaysAgo) {
        const dateKey = txnDate.toISOString().split('T')[0]; // YYYY-MM-DD
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + t.amount;
      }
    });
    
    // Generate 35 days of data
    const heatData: HeatmapDay[] = [];
    for (let i = 34; i >= 0; i--) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const dateKey = pastDate.toISOString().split('T')[0];
      const spend = dailyTotals[dateKey] || 0;
      
      heatData.push({
        value: Math.min(Math.floor(spend / 10), 4), // Scale: $0=0, $40+=4
        date: pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return heatData;
  };

  const heatData = getHeatData();
  
  // 5 weeks × 7 days
  const weeks = [4, 3, 2, 1, 0].map(weekOffset => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const dayIndexIn35 = (weekOffset * 7) + (6 - dayIndex);
      return heatData[dayIndexIn35];
    });
  });

  const getColor = (val: number): string => {
    const colors = [
      'rgba(255,255,255,0.05)',   // 0: No spending
      'rgba(251, 191, 36, 0.2)',  // 1: Light ($0-10)
      'rgba(245, 158, 11, 0.5)',  // 2: Medium ($10-20)
      'rgba(239, 68, 68, 0.7)',   // 3: High ($20-40)
      '#EF4444'                   // 4: Very high ($40+)
    ];
    return colors[val] || colors[0];
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {/* Weekday labels */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        paddingBottom: '4px', paddingTop: '2px', color: '#9CA3AF', 
        fontSize: '0.7rem', opacity: 0.6, minWidth: '30px'
      }}>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      
      {/* Heatmap grid */}
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {weeks.map((week, wIndex) => (
          <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
            {week.map((day, dIndex) => (
              <div
                key={dIndex}
                title={`${day.date}: $${(day.value * 10).toFixed(0)}`}
                style={{
                  flex: 1, 
                  minHeight: '12px',
                  borderRadius: '3px', 
                  backgroundColor: getColor(day.value),
                  opacity: day.value > 0 ? 1 : 0.3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
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

export default SpendingHeatmap;
