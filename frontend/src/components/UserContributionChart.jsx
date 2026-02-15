import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function UserContributionChart({ expenses, members }) {
  const userData = expenses.reduce((acc, expense) => {
    const userId = expense.paidById;
    const existing = acc.find(item => item.userId === userId);
    const amount = parseFloat(expense.amount);
    
    if (existing) {
      existing.paid += amount;
    } else {
      const member = members?.find(m => m.userId === userId);
      acc.push({
        userId,
        name: expense.paidBy?.name || member?.user?.name || 'Unknown',
        paid: amount
      });
    }
    return acc;
  }, []);

  const userDataWithOwed = userData.map(user => {
    const owed = expenses.reduce((sum, expense) => {
      const split = expense.splits?.find(s => s.userId === user.userId);
      return sum + (split ? parseFloat(split.amount) : 0);
    }, 0);
    
    return {
      ...user,
      owed,
      balance: user.paid - owed
    };
  });

  if (userDataWithOwed.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-500">
        No contribution data available
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Contributions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userDataWithOwed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="paid" fill="#3B82F6" name="Paid" />
          <Bar dataKey="owed" fill="#10B981" name="Owed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
