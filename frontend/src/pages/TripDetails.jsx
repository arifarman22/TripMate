import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService, expenseService } from '../services/api';
import ExpenseList from '../components/ExpenseList';
import BalanceSummary from '../components/BalanceSummary';
import AddExpenseModal from '../components/AddExpenseModal';
import CategoryChart from '../components/CategoryChart';
import UserContributionChart from '../components/UserContributionChart';
import ExpenseStats from '../components/ExpenseStats';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    try {
      const [tripData, expensesData, balancesData] = await Promise.all([
        tripService.getById(id),
        expenseService.getByTrip(id),
        tripService.getBalances(id)
      ]);
      setTrip(tripData);
      setExpenses(expensesData);
      setBalances(balancesData);
    } catch (error) {
      console.error('Failed to load trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
    setShowModal(false);
    loadTripData();
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!trip) return <div className="text-center py-12">Trip not found</div>;

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
        {trip.description && <p className="text-gray-600">{trip.description}</p>}
      </div>

      <ExpenseStats expenses={expenses} currency={trip.currency} />

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Balances
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'expenses' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              + Add Expense
            </button>
          </div>
          <ExpenseList expenses={expenses} currency={trip.currency} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <UserContributionChart expenses={expenses} members={trip.members} />
        </div>
      )}

      {activeTab === 'balances' && (
        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance Summary</h2>
          <BalanceSummary balances={balances} members={trip.members} currency={trip.currency} />
        </div>
      )}

      {showModal && (
        <AddExpenseModal
          tripId={id}
          members={trip.members}
          currency={trip.currency}
          onClose={() => setShowModal(false)}
          onSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
}
