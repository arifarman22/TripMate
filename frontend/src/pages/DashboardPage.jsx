import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tripService } from '../services/tripService'
import { expenseService } from '../services/expenseService'
import { 
  MapPin, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Plus,
  Calendar,
  DollarSign,
  Plane,
  ArrowRight
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MiniAnalytics from '../components/MiniAnalytics'

const DashboardPage = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalExpenses: 0,
    totalMembers: 0,
    totalBalance: 0
  })

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const data = await tripService.getTrips()
      setTrips(data)
      await calculateStats(data)
      await fetchRecentExpenses(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentExpenses = async (tripsData) => {
    try {
      const allExpenses = []
      for (const trip of tripsData.slice(0, 3)) { // Only recent trips
        const expenses = await expenseService.getExpenses(trip.id)
        allExpenses.push(...expenses.map(exp => ({ ...exp, tripName: trip.name, currency: trip.currency })))
      }
      
      // Sort by date and take recent 10
      const sortedExpenses = allExpenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
      
      setRecentExpenses(sortedExpenses)
    } catch (error) {
      console.error('Error fetching recent expenses:', error)
    }
  }

  const calculateStats = async (tripsData) => {
    const totalTrips = tripsData.length
    const totalMembers = tripsData.reduce((sum, trip) => sum + trip.members.length, 0)
    const totalExpenses = tripsData.reduce((sum, trip) => sum + (trip.expenses?.length || 0), 0)
    
    // Calculate total balance across all trips
    let totalBalance = 0
    for (const trip of tripsData) {
      try {
        const balances = await tripService.getBalances(trip.id)
        const userBalance = balances.find(b => b.userId === user.id)
        if (userBalance) {
          totalBalance += userBalance.netBalance
        }
      } catch (error) {
        console.error(`Error fetching balance for trip ${trip.id}:`, error)
      }
    }
    
    setStats({
      totalTrips,
      totalExpenses,
      totalMembers,
      totalBalance
    })
  }

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  const recentTrips = trips.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Plane className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! ✈️
          </h1>
          <p className="text-blue-100 text-lg">
            Ready for your next adventure? Manage your trips and expenses here.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExpenses}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Travel Buddies</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="travel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Your Balance</p>
              <p className={`text-3xl font-bold ${
                stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${Math.abs(stats.totalBalance).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {stats.totalBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              stats.totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trips */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trips Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
              <Link
                to="/trips"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.map((trip) => {
                  const totalSpent = trip.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0
                  return (
                    <Link
                      key={trip.id}
                      to={`/trips/${trip.id}`}
                      className="travel-card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{trip.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {trip.members.length} members • {trip.expenses?.length || 0} expenses
                            </p>
                            {trip.budget && (
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-32">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${Math.min((totalSpent / parseFloat(trip.budget)) * 100, 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {((totalSpent / parseFloat(trip.budget)) * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(trip.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {trip.currency} {totalSpent.toFixed(2)}
                          </p>
                          {trip.budget && (
                            <p className="text-xs text-gray-500">
                              of {trip.currency} {parseFloat(trip.budget).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="travel-card p-12 text-center">
                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first trip to start managing expenses with friends
                </p>
                <Link
                  to="/trips"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Trip</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Expenses Analytics */}
          {recentExpenses.length > 0 && (
            <MiniAnalytics 
              expenses={recentExpenses}
              currency="USD" // Mixed currencies, using USD as default
            />
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/trips"
              className="travel-card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create New Trip</h3>
                  <p className="text-gray-600 text-sm">Start planning your next adventure</p>
                </div>
              </div>
            </Link>

            <div className="travel-card p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Balance</h3>
                  <p className={`text-lg font-bold ${
                    stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(stats.totalBalance).toFixed(2)} 
                    <span className="text-sm font-normal text-gray-600">
                      {stats.totalBalance >= 0 ? ' owed to you' : ' you owe'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="travel-card p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Trip Summary</h3>
                  <p className="text-gray-600 text-sm">
                    {stats.totalTrips} trips • {stats.totalExpenses} expenses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage