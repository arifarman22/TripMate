import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'

const ExpenseAnalytics = ({ expenses, currency, members }) => {
  const categoryData = useMemo(() => {
    const categories = {}
    expenses.forEach(expense => {
      const category = expense.category || 'other'
      categories[category] = (categories[category] || 0) + parseFloat(expense.amount)
    })
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2)),
      percentage: ((value / expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)) * 100).toFixed(1)
    }))
  }, [expenses])

  const userContributionData = useMemo(() => {
    const contributions = {}
    
    // Initialize all members
    members.forEach(member => {
      contributions[member.userId] = {
        name: member.user.name,
        paid: 0,
        owed: 0
      }
    })
    
    // Calculate paid amounts
    expenses.forEach(expense => {
      if (contributions[expense.paidById]) {
        contributions[expense.paidById].paid += parseFloat(expense.amount)
      }
    })
    
    // Calculate owed amounts from splits
    expenses.forEach(expense => {
      expense.splits.forEach(split => {
        if (contributions[split.userId]) {
          contributions[split.userId].owed += parseFloat(split.amount)
        }
      })
    })
    
    return Object.values(contributions).map(user => ({
      name: user.name,
      paid: parseFloat(user.paid.toFixed(2)),
      owed: parseFloat(user.owed.toFixed(2)),
      net: parseFloat((user.paid - user.owed).toFixed(2))
    }))
  }, [expenses, members])

  const CATEGORY_COLORS = {
    'Food': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Accommodation': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Shopping': '#FFEAA7',
    'Other': '#DDA0DD'
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {currency} {entry.value}
              {entry.payload.percentage && ` (${entry.payload.percentage}%)`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {currency} {data.value} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (expenses.length === 0) {
    return (
      <div className="travel-card p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
        <p className="text-gray-600">Add some expenses to see analytics and insights</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Expense Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="travel-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || '#DDA0DD'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Summary */}
          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category.name] || '#DDA0DD' }}
                  ></div>
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {currency} {category.value} ({category.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Contributions */}
        <div className="travel-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Member Contributions</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userContributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="paid" fill="#4ECDC4" name="Paid" />
                <Bar dataKey="owed" fill="#FF6B6B" name="Owes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Summary */}
          <div className="mt-4 space-y-3">
            {userContributionData.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="flex space-x-4">
                    <span className="text-green-600">
                      Paid: {currency} {user.paid}
                    </span>
                    <span className="text-red-600">
                      Owes: {currency} {user.owed}
                    </span>
                  </div>
                  <div className={`font-medium ${user.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Net: {currency} {Math.abs(user.net)} {user.net >= 0 ? 'owed' : 'owes'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="travel-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {categoryData.length}
          </div>
          <div className="text-gray-600">Categories Used</div>
        </div>
        
        <div className="travel-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {currency} {expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
          </div>
          <div className="text-gray-600">Total Spent</div>
        </div>
        
        <div className="travel-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {(expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / members.length).toFixed(2)}
          </div>
          <div className="text-gray-600">Avg per Person ({currency})</div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseAnalytics