import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const BudgetProgress = ({ budget, spent, currency }) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0
  const remaining = budget - spent
  
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  const getStatusIcon = () => {
    if (percentage >= 100) return <AlertTriangle className="w-5 h-5 text-red-600" />
    if (percentage >= 80) return <TrendingUp className="w-5 h-5 text-yellow-600" />
    return <CheckCircle className="w-5 h-5 text-green-600" />
  }
  
  const getStatusText = () => {
    if (percentage >= 100) return 'Over budget'
    if (percentage >= 80) return 'Approaching limit'
    return 'On track'
  }
  
  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="travel-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Spent: {currency} {spent.toFixed(2)}</span>
          <span>Budget: {currency} {budget.toFixed(2)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{percentage.toFixed(1)}% used</span>
          <span>
            {remaining >= 0 ? 'Remaining' : 'Over by'}: {currency} {Math.abs(remaining).toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Budget Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {currency} {spent.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Spent</p>
        </div>
        
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Used</p>
        </div>
        
        <div>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currency} {Math.abs(remaining).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BudgetProgress
