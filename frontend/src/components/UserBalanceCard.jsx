import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const UserBalanceCard = ({ balance, currency }) => {
  if (!balance) return null

  const getStatusColor = () => {
    if (balance.status === 'owed') return 'text-green-600 bg-green-50'
    if (balance.status === 'owes') return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getStatusText = () => {
    if (balance.status === 'owed') return 'You are owed'
    if (balance.status === 'owes') return 'You owe'
    return 'All settled'
  }

  return (
    <div className="travel-card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
      <div className="flex items-center space-x-2 mb-4">
        <Wallet className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Your Balance</h3>
      </div>

      <div className="space-y-4">
        {/* Net Balance */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-1">{getStatusText()}</p>
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusColor()}`}>
            {balance.status === 'owed' && <TrendingUp className="w-5 h-5" />}
            {balance.status === 'owes' && <TrendingDown className="w-5 h-5" />}
            {balance.status === 'settled' && <DollarSign className="w-5 h-5" />}
            <span className="text-2xl font-bold">
              {currency} {Math.abs(balance.netBalance).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">You Paid</p>
            <p className="text-lg font-semibold text-gray-900">
              {currency} {balance.totalPaid.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {balance.expensesPaid} expense{balance.expensesPaid !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Your Share</p>
            <p className="text-lg font-semibold text-gray-900">
              {currency} {balance.totalOwed.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total owed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBalanceCard
