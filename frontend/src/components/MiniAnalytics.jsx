import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react'

const MiniAnalytics = ({ expenses, currency }) => {
  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return []
    
    const categories = {}
    expenses.forEach(expense => {
      const category = expense.category || 'other'
      categories[category] = (categories[category] || 0) + parseFloat(expense.amount)
    })
    
    return Object.entries(categories)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4) // Top 4 categories
  }, [expenses])

  const totalSpent = useMemo(() => {
    return expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0
  }, [expenses])

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']

  if (!expenses || expenses.length === 0) {
    return (
      <div className="travel-card p-6 text-center">
        <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">No expenses to analyze</p>
      </div>
    )
  }

  return (
    <div className="travel-card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Mini Pie Chart */}
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={35}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category List */}
        <div className="flex-1 space-y-2">
          {categoryData.map((category, index) => {
            const percentage = ((category.value / totalSpent) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {currency} {category.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage}%
                  </div>
                </div>
              </div>
            )
          })}
          
          {categoryData.length === 0 && (
            <p className="text-gray-500 text-sm">No categories yet</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Spent</span>
          <span className="text-lg font-bold text-gray-900">
            {currency} {totalSpent.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MiniAnalytics