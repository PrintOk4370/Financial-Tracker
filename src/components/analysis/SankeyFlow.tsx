// src/components/charts/SankeyFlow.tsx
import React, { useMemo } from 'react';
import type { Transaction } from '../../types/index.ts';

interface SankeyFlowProps {
  transactions: Transaction[];
  // Optionally pass target monthly budget
  budget?: number;
}

const SankeyFlow: React.FC<SankeyFlowProps> = ({ transactions, budget = 5000 }) => {
  // 1. Calculate category flows (Live!)
  const flow = useMemo(() => {
    const totalOutflow = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Logic: Needs (Food, Housing, Utilities) vs Wants (Shopping, Entertainment)
    const needs = transactions
      .filter(t => ['Food', 'Housing', 'Utilities', 'Transport'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const wants = transactions
      .filter(t => !['Food', 'Housing', 'Utilities', 'Transport'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = Math.max(0, budget - totalOutflow);
    
    // Scale widths (max width 60px)
    const scale = 100 / (needs + wants + savings || 1);
    
    return {
      total: needs + wants + savings,
      needsWidth: Math.max(needs * scale, 5),
      wantsWidth: Math.max(wants * scale, 5),
      savingsWidth: Math.max(savings * scale, 5),
      needsY: 20,
      wantsY: 100,
      savingsY: 160
    };
  }, [transactions, budget]);

  return (
    <svg width="100%" height="200" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Source (Income) */}
      <rect x="0" y="40" width="10" height="120" rx="4" fill="#2DD4BF" />
      <text x="0" y="30" fill="#9CA3AF" fontSize="10" fontWeight="bold">INCOME: ${budget}</text>

      {/* Destinations (Live Categories) */}
      <rect x="390" y={flow.needsY} width="10" height={flow.needsWidth} rx="4" fill="#818CF8" />
      <text x="360" y={flow.needsY - 5} fill="#9CA3AF" fontSize="10">Needs</text>

      <rect x="390" y={flow.wantsY} width="10" height={flow.wantsWidth} rx="4" fill="#FB7185" />
      <text x="360" y={flow.wantsY - 5} fill="#9CA3AF" fontSize="10">Wants</text>

      <rect x="390" y={flow.savingsY} width="10" height={flow.savingsWidth} rx="4" fill="#2DD4BF" />
      <text x="360" y={flow.savingsY - 5} fill="#9CA3AF" fontSize="10">Save</text>

      {/* Paths (Dynamic Width + Bézier curves) */}
      {/* Income -> Needs */}
      <path
        d={`M 10 100 C 200 100, 200 ${flow.needsY + flow.needsWidth/2}, 390 ${flow.needsY + flow.needsWidth/2}`}
        fill="none"
        stroke="url(#grad1)"
        strokeWidth={flow.needsWidth}
        opacity="0.3"
        style={{ transition: 'all 0.5s ease' }}
      />
      
      {/* Income -> Wants */}
      <path
        d={`M 10 100 C 200 100, 200 ${flow.wantsY + flow.wantsWidth/2}, 390 ${flow.wantsY + flow.wantsWidth/2}`}
        fill="none"
        stroke="#FB7185"
        strokeWidth={flow.wantsWidth}
        opacity="0.2"
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Income -> Savings */}
      <path
        d={`M 10 100 C 200 100, 200 ${flow.savingsY + flow.savingsWidth/2}, 390 ${flow.savingsY + flow.savingsWidth/2}`}
        fill="none"
        stroke="#2DD4BF"
        strokeWidth={flow.savingsWidth}
        opacity="0.2"
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Labels with exact values */}
      <text x="200" y="20" textAnchor="middle" fill="#9CA3AF" fontSize="9" opacity="0.5">
        Live Money Flow Audit
      </text>
    </svg>
  );
};

export default SankeyFlow;
