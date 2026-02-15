import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function CategoryChart({ expenses }) {
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += parseFloat(expense.amount);
    } else {
      acc.push({ name: category, value: parseFloat(expense.amount) });
    }
    return acc;
  }, []);

  if (categoryData.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-500">
        No expense data available
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
