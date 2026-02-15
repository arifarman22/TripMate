export default function ExpenseList({ expenses, currency }) {
  if (expenses.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-500">
        No expenses yet. Add your first expense!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div key={expense.id} className="card flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900">{expense.description}</h4>
            <p className="text-sm text-gray-500">
              Paid by {expense.paidBy?.name} • {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {currency} {parseFloat(expense.amount).toFixed(2)}
            </p>
            {expense.category && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {expense.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
