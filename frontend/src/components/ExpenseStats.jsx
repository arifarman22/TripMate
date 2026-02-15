export default function ExpenseStats({ expenses, currency }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  
  const categories = [...new Set(expenses.map(e => e.category || 'Other'))];
  const topCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});
  
  const topCategoryName = Object.keys(topCategory).reduce((a, b) => 
    topCategory[a] > topCategory[b] ? a : b, 'None'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="card">
        <p className="text-sm text-gray-500 mb-1">Total Spent</p>
        <p className="text-2xl font-bold text-gray-900">
          {currency} {totalSpent.toFixed(2)}
        </p>
      </div>
      <div className="card">
        <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
      </div>
      <div className="card">
        <p className="text-sm text-gray-500 mb-1">Average Expense</p>
        <p className="text-2xl font-bold text-gray-900">
          {currency} {avgExpense.toFixed(2)}
        </p>
      </div>
      <div className="card">
        <p className="text-sm text-gray-500 mb-1">Top Category</p>
        <p className="text-2xl font-bold text-gray-900">{topCategoryName}</p>
      </div>
    </div>
  );
}
