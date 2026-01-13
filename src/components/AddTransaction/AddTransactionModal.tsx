import React, { useState, useRef } from 'react';
import { useTransactions } from '../../hooks/useTransaction.ts';  // Adjust path
import { ManualEntry, ReviewTransaction } from '../../types/index.ts'; // Adjust path

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  isOpen, onClose 
}) => {
  const { addTransactions } = useTransactions();
  const [mode, setMode] = useState<'manual' | 'upload'>('manual');
  const [stage, setStage] = useState<'input' | 'processing' | 'review'>('input');
  const [file, setFile] = useState<File | null>(null);
  
  // Manual Form State
  const [manualEntry, setManualEntry] = useState<ManualEntry>({ 
    date: '', 
    desc: '', 
    amount: '', 
    cat: 'Food' 
  });

  // Staging State (The AI Parsed Data)
  const [parsedTxns, setParsedTxns] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      simulateLLMParsing(selected);
    }
  };

  const simulateLLMParsing = async (file: File) => {
    setStage('processing');
    
    // MOCK: This simulates your backend 'parser.py' running OCR + Sonar
    setTimeout(() => {
      const mockLLMResponse: any[] = [  // ✅ any[] - hook maps to DB
        { 
          date: '2025-10-12', 
          desc: 'STARBUCKS COFFEE', 
          amount: 14.50, 
          cat: 'Food', 
          approved: true 
        },      
    ];
      setParsedTxns(mockLLMResponse);
      setStage('review');
    }, 2500);
  };

  const toggleApproval = (id: number) => {
    setParsedTxns(prev => prev.map(t => 
      t.id === id ? { ...t, approved: !t.approved } : t
    ));
  };

  const updateField = (id: number, field: keyof ReviewTransaction, value: string | number) => {
    setParsedTxns(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ) as any[]);
  };

  const finalizeTransactions = async() => {
    const approvedOnly = parsedTxns.filter(t => t.approved);
    await addTransactions(approvedOnly);
    onClose();
    // Reset
    setStage('input');
    setParsedTxns([]);
  };

  // Manual entry:
  const handleManualSave = async () => {
    await addTransactions([{ 
      date: manualEntry.date,
      desc: manualEntry.desc,
      amount: manualEntry.amount,
      cat: manualEntry.cat 
    }]);
    onClose();
  };

  // --- Renders ---

  const renderManual = () => (
    <div className="animate-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <input 
          type="date" 
          value={manualEntry.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setManualEntry({...manualEntry, date: e.target.value})
          }
        />
        <input 
          type="number" 
          placeholder="Amount ($)" 
          value={manualEntry.amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setManualEntry({...manualEntry, amount: e.target.value})
          }
        />
      </div>
      <input 
        type="text" 
        placeholder="Description (e.g. Wal-Mart)" 
        value={manualEntry.desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setManualEntry({...manualEntry, desc: e.target.value})
        }
        style={{ marginBottom: '16px' }}
      />
      <select 
        value={manualEntry.cat}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
          setManualEntry({...manualEntry, cat: e.target.value})
        }
        style={{ 
          width: '100%', 
          padding: '12px', 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          color: 'white', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}
      >
        <option value="Food">Food & Dining</option>
        <option value="Transport">Transportation</option>
        <option value="Housing">Housing</option>
        <option value="Shopping">Shopping</option>
      </select>
      <button 
        className="btn-primary" 
        style={{ width: '100%' }} 
        onClick={handleManualSave}
      >
        Add Expense
      </button>
    </div>
  );

  const renderUpload = () => (
    <div 
      className="animate-enter" 
      style={{ 
        textAlign: 'center', 
        padding: '20px', 
        border: '2px dashed rgba(255,255,255,0.1)', 
        borderRadius: '12px', 
        cursor: 'pointer' 
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".pdf,.jpg,.png" 
        onChange={handleFileUpload} 
      />
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Drop Statement or Click to Upload</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports PDF, JPG, PNG</div>
    </div>
  );

  const renderProcessing = () => (
    <div style={{ textAlign: 'center', padding: '40px' }} className="animate-enter">
      <div className="spinner" /> {/* You can add simple CSS spinner */}
      <h3 style={{ marginTop: '20px' }}>AI Analysis in Progress...</h3>
      <p style={{ color: 'var(--text-muted)' }}>Running OCR & extracting entities via Sonar</p>
    </div>
  );

  const renderReview = () => (
    <div className="animate-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Review Extracted Data</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {parsedTxns.filter(t => t.approved).length} selected
        </span>
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead style={{ background: 'rgba(255,255,255,0.05)', position: 'sticky', top: 0 }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Approve</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {parsedTxns.map((txn) => (
              <tr 
                key={txn.id} 
                style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  opacity: txn.approved ? 1 : 0.5 
                }}
              >
                <td style={{ padding: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={txn.approved} 
                    onChange={() => toggleApproval(txn.id)}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-teal)' }}
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <input 
                    type="text" 
                    value={txn.date} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateField(txn.id, 'date', e.target.value)
                    }
                    style={{ background: 'transparent', border: 'none', color: 'inherit', width: '90px' }}
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <input 
                    type="text" 
                    value={txn.desc} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateField(txn.id, 'desc', e.target.value)
                    }
                    style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
                  />
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <input 
                    type="number" 
                    value={txn.amount} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateField(txn.id, 'amount', e.target.value)
                    }
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'inherit', 
                      width: '70px', 
                      textAlign: 'right' 
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          className="btn-ghost" 
          style={{ flex: 1 }} 
          onClick={() => { 
            setStage('input'); 
            setFile(null); 
          }}
        >
          Discard
        </button>
        <button 
          className="btn-primary" 
          style={{ flex: 2 }} 
          onClick={finalizeTransactions}
        >
          Finalize & Save
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      position: 'fixed' as const, 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.8)', 
      backdropFilter: 'blur(5px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div 
        className="card" 
        style={{ 
          width: '600px', 
          maxWidth: '90vw', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {stage !== 'review' && (
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                color: mode === 'manual' ? 'var(--primary-teal)' : 'var(--text-muted)', 
                borderBottom: mode === 'manual' ? '2px solid var(--primary-teal)' : 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
              onClick={() => setMode('manual')}
            >
              Manual Entry
            </button>
            <button 
              style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                color: mode === 'upload' ? 'var(--primary-teal)' : 'var(--text-muted)', 
                borderBottom: mode === 'upload' ? '2px solid var(--primary-teal)' : 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
              onClick={() => setMode('upload')}
            >
              AI Statement Parser
            </button>
          </div>
        )}

        {stage === 'input' && mode === 'manual' && renderManual()}
        {stage === 'input' && mode === 'upload' && renderUpload()}
        {stage === 'processing' && renderProcessing()}
        {stage === 'review' && renderReview()}

        {stage === 'input' && (
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '1.5rem', 
              cursor: 'pointer' 
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTransactionModal;
