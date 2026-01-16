import React from 'react';
import { ReviewTransaction } from '../../types';
import '../../css/addTransactionModal.css';

interface ReviewTableProps {
  parsedTxns: ReviewTransaction[];
  toggleApproval: (id: number) => void;
  updateField: (
    id: number,
    field: keyof ReviewTransaction,
    value: string | number,
  ) => void;
  finalizeTransactions: () => void;
  onDiscard: () => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  parsedTxns,
  toggleApproval,
  updateField,
  finalizeTransactions,
  onDiscard,
}) => (
  <div className="animate-enter">
    <div className="reviewHeader">
      <h3>Review Extracted Data</h3>
      <span className="reviewCount">
        {parsedTxns.filter(t => t.approved).length} selected
      </span>
    </div>

    <div className="reviewTableContainer">
      <table className="reviewTable">
        <thead className="reviewThead">
          <tr>
            <th className="reviewTh">Approve</th>
            <th className="reviewTh">Date</th>
            <th className="reviewTh">Description</th>
            <th className="reviewTh reviewThRight">Amount</th>
          </tr>
        </thead>
        <tbody>
          {parsedTxns.map(txn => (
            <tr
              key={txn.id}
              className={`reviewRow ${txn.approved ? 'reviewRowApproved' : 'reviewRowUnapproved'}`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={txn.approved}
                  onChange={() => toggleApproval(txn.id)}
                  className="reviewCheckbox"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={txn.date}
                  onChange={e => updateField(txn.id, 'date', e.target.value)}
                  className="reviewInput reviewDateInput"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={txn.desc}
                  onChange={e => updateField(txn.id, 'desc', e.target.value)}
                  className="reviewInput"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={txn.amount}
                  onChange={e => updateField(txn.id, 'amount', e.target.value)}
                  className="reviewInput reviewAmountInput"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="reviewActionButtons">
      <button className="btn-ghost" style={{ flex: 1 }} onClick={onDiscard}>
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
