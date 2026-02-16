import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { tripService } from '../services/tripService'
import { expenseService } from '../services/expenseService'
import { useAuth } from '../context/AuthContext'
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Plus, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Receipt,
  BarChart3,
  Trash2,
  UserPlus
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ExpenseList from '../components/ExpenseList'
import AddExpenseModal from '../components/AddExpenseModal'
import BalanceSummary from '../components/BalanceSummary'
import BudgetProgress from '../components/BudgetProgress'
import ExpenseAnalytics from '../components/ExpenseAnalytics'
import InviteMemberModal from '../components/InviteMemberModal'
import MembersList from '../components/MembersList'
import UserBalanceCard from '../components/UserBalanceCard'
import toast from 'react-hot-toast'

const TripDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [userBalance, setUserBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInviteMember, setShowInviteMember] = useState(false)
  const [activeTab, setActiveTab] = useState('expenses')

  useEffect(() => {
    if (id) {
      fetchTripData()
    }
  }, [id])

  const fetchTripData = async () => {
    try {
      const [tripData, expensesData, balancesData, userBalanceData] = await Promise.all([
        tripService.getTripById(id),
        expenseService.getExpenses(id),
        tripService.getBalances(id),
        tripService.getUserBalance(id)
      ])
      
      setTrip(tripData)
      setExpenses(expensesData)
      setBalances(balancesData)
      setUserBalance(userBalanceData)
    } catch (error) {
      toast.error('Failed to load trip data')
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses])
    setShowAddExpense(false)
    fetchTripData() // Refresh balances
    toast.success('Expense added successfully!')
  }

  const handleExpenseDeleted = (expenseId) => {
    setExpenses(expenses.filter(exp => exp.id !== expenseId))
    fetchTripData() // Refresh balances
  }

  const handleDeleteTrip = async () => {
    try {
      await tripService.deleteTrip(id)
      toast.success('Trip deleted successfully!')
      navigate('/trips')
    } catch (error) {
      toast.error('Failed to delete trip')
    }
  }

  const handleMemberAdded = (newMember) => {
    setTrip({ ...trip, members: [...trip.members, newMember] })
    setShowInviteMember(false)
  }

  const handleMemberRemoved = (userId) => {
    setTrip({ ...trip, members: trip.members.filter(m => m.userId !== userId) })
  }

  const isAdmin = trip?.members.find(m => m.userId === user?.id)?.role === 'admin'

  if (loading) {
    return <LoadingSpinner message="Loading trip details..." />
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h1>
        <Link to="/trips" className="btn-primary">Back to Trips</Link>
      </div>
    )
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
  const budget = trip.budget ? parseFloat(trip.budget) : 0
  const budgetUsed = budget > 0 ? (totalSpent / budget) * 100 : 0

  const tabs = [
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'balances', label: 'Balances', icon: TrendingUp },
    { id: 'members', label: 'Members', icon: Users }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/trips"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
            {trip.description && (
              <p className="text-gray-600 mt-1">{trip.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowInviteMember(true)}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite Member</span>
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-secondary inline-flex items-center space-x-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Trip</span>
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Members</p>
              <p className="text-3xl font-bold text-gray-900">{trip.members.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">
                {trip.currency} {totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Budget</p>
              <p className="text-3xl font-bold text-gray-900">
                {trip.currency} {budget.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Expenses</p>
              <p className="text-3xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Receipt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      {budget > 0 && (
        <BudgetProgress 
          budget={budget}
          spent={totalSpent}
          currency={trip.currency}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <UserBalanceCard balance={userBalance} currency={trip.currency} />
              <ExpenseList 
                expenses={expenses}
                currency={trip.currency}
                onExpenseDeleted={handleExpenseDeleted}
              />
            </div>
            <div>
              <BalanceSummary 
                balances={balances}
                currency={trip.currency}
                tripId={id}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <ExpenseAnalytics 
            expenses={expenses}
            currency={trip.currency}
            members={trip.members}
          />
        )}

        {activeTab === 'balances' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <UserBalanceCard balance={userBalance} currency={trip.currency} />
            <BalanceSummary 
              balances={balances}
              currency={trip.currency}
              tripId={id}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="max-w-2xl mx-auto">
            <MembersList 
              members={trip.members}
              tripId={id}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onMemberRemoved={handleMemberRemoved}
            />
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          tripId={id}
          members={trip.members}
          currency={trip.currency}
          onClose={() => setShowAddExpense(false)}
          onExpenseAdded={handleExpenseAdded}
        />
      )}

      {/* Invite Member Modal */}
      {showInviteMember && (
        <InviteMemberModal
          tripId={id}
          onClose={() => setShowInviteMember(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Trip?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{trip.name}"? This action cannot be undone and will delete all expenses and data associated with this trip.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTrip}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetailPage