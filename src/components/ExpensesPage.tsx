// components/ExpensesTab.tsx

import React, { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransaction.ts';
import { Transaction } from '../types/index.ts';

const ExpensesTab: React.FC = () => {
  const { transactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tx => tx.category === selectedCategory);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedCategory]);

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  };

  const categories = Array.from(new Set(transactions.map(tx => tx.category)))
    .sort();

  return (
    <div className="animate-enter" style={{ padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Expenses</h2>
        
        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              flex: 1,
              minWidth: '300px'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'white'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              ${getTotalAmount().toFixed(2)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {filteredTransactions.length} transactions
            </div>
          </div>
          <button 
            style={{
              padding: '12px 24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        </div>

        {/* Transaction list */}
        <div style={{ maxHeight: '600px', overflow: 'auto' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: 'var(--text-muted)' 
            }}>
              No transactions match your filters
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    background: 'white'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {tx.merchant || tx.description || 'Unknown'}
                    </div>
                    <div style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.9rem',
                      display: 'flex',
                      gap: '16px'
                    }}>
                      <span>{tx.expenseDate}</span>
                      <span>{tx.category}</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: tx.amount > 0 ? 'var(--positive)' : 'var(--negative)'
                  }}>
                    {tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTab;