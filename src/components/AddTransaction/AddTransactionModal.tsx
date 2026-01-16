import React, { useState, useRef } from 'react';
import { useTransactions } from '../../hooks/useTransaction';
import { ManualEntry, ReviewTransaction } from '../../types';
import { ManualEntryForm } from './ManualEntryForm';
import { UploadPanel } from './UploadPanel';
import { ProcessingView } from './ProcessingView';
import { ReviewTable } from './ReviewTable';
import '../../css/addTransactionModal.css';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransactions } = useTransactions();
  const [mode, setMode] = useState<'manual' | 'upload'>('manual');
  const [stage, setStage] = useState<'input' | 'processing' | 'review'>('input');
  const [manualEntry, setManualEntry] = useState<ManualEntry>({
    date: '',
    desc: '',
    amount: '',
    cat: 'Food',
  });
  const [parsedTxns, setParsedTxns] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleApproval = (id: number) => {
    setParsedTxns(prev =>
      prev.map(t => (t.id === id ? { ...t, approved: !t.approved } : t)),
    );
  };

  const updateField = (
    id: number,
    field: keyof ReviewTransaction,
    value: string | number,
  ) => {
    setParsedTxns(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const finalizeTransactions = async () => {
    const approvedOnly = parsedTxns.filter(t => t.approved);
    await addTransactions(approvedOnly);
    onClose();
    setStage('input');
    setParsedTxns([]);
  };

  const handleManualSave = async () => {
    await addTransactions([
      {
        date: manualEntry.date,
        desc: manualEntry.desc,
        amount: manualEntry.amount,
        cat: manualEntry.cat,
      },
    ]);
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        {stage !== 'review' && (
          <div className="tabHeader">
            <button
              className={`tabButton ${mode === 'manual' ? 'tabButtonActive' : 'tabButtonInactive'}`}
              onClick={() => setMode('manual')}
            >
              Manual Entry
            </button>
            <button
              className={`tabButton ${mode === 'upload' ? 'tabButtonActive' : 'tabButtonInactive'}`}
              onClick={() => setMode('upload')}
            >
              AI Statement Parser
            </button>
          </div>
        )}

        {stage === 'input' && mode === 'manual' && (
          <ManualEntryForm
            entry={manualEntry}
            setEntry={setManualEntry}
            onSave={handleManualSave}
          />
        )}
        {stage === 'input' && mode === 'upload' && (
          <UploadPanel fileInputRef={fileInputRef} />
        )}
        {stage === 'processing' && <ProcessingView />}
        {stage === 'review' && (
          <ReviewTable
            parsedTxns={parsedTxns}
            toggleApproval={toggleApproval}
            updateField={updateField}
            finalizeTransactions={finalizeTransactions}
            onDiscard={() => setStage('input')}
          />
        )}

        {stage === 'input' && (
          <button className="closeButton" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTransactionModal;
