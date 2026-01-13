import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource.ts';  // Adjust path
import { getCurrentUser } from 'aws-amplify/auth';
import outputs from '../../amplify_outputs.json';  // Adjust path
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);
const client = generateClient<Schema>();

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.userId);

        const { data } = await client.models.Expense.list();
        setTransactions(data || []);

        // Live sync
        const sub = client.models.Expense.observeQuery().subscribe(({ items }) => {
          setTransactions(items);
          setLoading(false);
        });
        return () => sub.unsubscribe();
      } catch (e) {
        console.error('Auth error:', e);
        setLoading(false);
      }
    };
    init();
  }, []);

  const addTransaction = async (txn: any) => {
    await client.models.Expense.create({
      expenseDate: txn.date || txn.expenseDate || new Date().toISOString().split('T')[0],
      description: txn.desc || txn.description || '',
      amount: Number(txn.amount),
      category: txn.cat || txn.category || 'Other',
      userID: userId,
      merchant: txn.merchant || '',
    });
    // Live sub auto-updates list
  };

  const addTransactions = async (txns: any[]) => {
    for (const txn of txns) {
      await addTransaction(txn);
    }
  };

  return {
    transactions,
    loading,
    userId,
    addTransaction,
    addTransactions,
  };
};
