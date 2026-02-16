export default function BalanceSummary({ balances, members, currency }) {
  const getMemberName = (userId) => {
    const member = members?.find(m => m.userId === userId);
    return member?.user?.name || 'Unknown';
  };

  return (
    <div className="card">
      {Object.keys(balances).length === 0 ? (
        <p className="text-gray-500 text-center py-4">No balances yet</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(balances).map(([userId, balance]) => {
            const numBalance = Number(balance) || 0;
            return (
              <div key={userId} className="flex justify-between items-center pb-3 border-b last:border-0">
                <span className="font-medium text-gray-900">{getMemberName(userId)}</span>
                <span className={`font-semibold ${numBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {numBalance >= 0 ? '+' : ''}{currency} {numBalance.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
