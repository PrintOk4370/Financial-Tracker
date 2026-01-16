import React from 'react';
import { ManualEntry } from '../../types';
import '../../css/addTransactionModal.css';

interface ManualEntryFormProps {
  entry: ManualEntry;
  setEntry: React.Dispatch<React.SetStateAction<ManualEntry>>;
  onSave: () => void;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  entry,
  setEntry,
  onSave,
}) => (
  <div className="animate-enter">
    <div className="manualFormGrid">
      <input
        type="date"
        value={entry.date}
        onChange={e => setEntry({ ...entry, date: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount ($)"
        value={entry.amount}
        onChange={e => setEntry({ ...entry, amount: e.target.value })}
      />
    </div>
    <input
      type="text"
      placeholder="Description (e.g. Wal-Mart)"
      value={entry.desc}
      onChange={e => setEntry({ ...entry, desc: e.target.value })}
      className="manualDescInput"
    />
    <select
      value={entry.cat}
      onChange={e => setEntry({ ...entry, cat: e.target.value })}
      className="manualCategorySelect"
    >
      <option value="Food">Food & Dining</option>
      <option value="Transport">Transportation</option>
      <option value="Housing">Housing</option>
      <option value="Shopping">Shopping</option>
    </select>
    <button className="btn-primary manualSaveButton" onClick={onSave}>
      Add Expense
    </button>
  </div>
);
