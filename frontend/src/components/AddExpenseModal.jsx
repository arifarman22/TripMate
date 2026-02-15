import { useState } from 'react';
import { expenseService } from '../services/expenseService';
import Modal from './Modal';

export default function AddExpenseModal({ tripId, members, currency, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food'
  });
  const [splitType, setSplitType] = useState('equal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      const splits = members.map(member => ({
        userId: member.userId,
        amount: (amount / members.length).toFixed(2)
      }));

      const expense = await expenseService.create({
        tripId,
        description: formData.description,
        amount,
        category: formData.category,
        splits
      });

      onSuccess(expense);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Expense" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currency})</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input"
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Split Type</label>
          <select value={splitType} onChange={(e) => setSplitType(e.target.value)} className="input">
            <option value="equal">Split Equally</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {members.length} members • {currency} {(parseFloat(formData.amount || 0) / members.length).toFixed(2)} each
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex-1">
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
