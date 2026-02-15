const tripRepository = require('../repositories/trip.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

const createTrip = async (userId, { name, description, currency, budget, startDate, endDate }) => {
  const tripData = { name, description, currency };
  if (budget) tripData.budget = budget;
  if (startDate) tripData.startDate = new Date(startDate);
  if (endDate) tripData.endDate = new Date(endDate);
  
  const trip = await tripRepository.create(tripData);
  await tripRepository.addMember(trip.id, userId, 'admin');
  return await tripRepository.findById(trip.id);
};

const getUserTrips = async (userId) => {
  return await tripRepository.findByUserId(userId);
};

const getTripById = async (tripId, userId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isMember = trip.members.some(m => m.userId === userId);
  if (!isMember) throw new AppError('Access denied', 403);

  return trip;
};

const updateTrip = async (tripId, userId, updateData) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isAdmin = trip.members.some(m => m.userId === userId && m.role === 'admin');
  if (!isAdmin) throw new AppError('Only team leads can update trips', 403);

  const { name, description, currency, budget, startDate, endDate } = updateData;
  const tripData = {};
  if (name) tripData.name = name;
  if (description !== undefined) tripData.description = description;
  if (currency) tripData.currency = currency;
  if (budget !== undefined) tripData.budget = budget;
  if (startDate) tripData.startDate = new Date(startDate);
  if (endDate) tripData.endDate = new Date(endDate);

  return await tripRepository.update(tripId, tripData);
};

const deleteTrip = async (tripId, userId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isAdmin = trip.members.some(m => m.userId === userId && m.role === 'admin');
  if (!isAdmin) throw new AppError('Only team leads can delete trips', 403);

  return await tripRepository.deleteTrip(tripId);
};

const addMember = async (tripId, email, requesterId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isAdmin = trip.members.some(m => m.userId === requesterId && m.role === 'admin');
  if (!isAdmin) throw new AppError('Only team leads can add members', 403);

  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('User not found', 404);

  try {
    return await tripRepository.addMember(tripId, user.id, 'member');
  } catch (error) {
    if (error.message === 'User is already a member') {
      throw new AppError('User is already a member of this trip', 400);
    }
    throw error;
  }
};

const removeMember = async (tripId, userId, requesterId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isAdmin = trip.members.some(m => m.userId === requesterId && m.role === 'admin');
  if (!isAdmin) throw new AppError('Only team leads can remove members', 403);

  const targetMember = trip.members.find(m => m.userId === userId);
  if (!targetMember) throw new AppError('User is not a member of this trip', 404);
  if (targetMember.role === 'admin') throw new AppError('Cannot remove team lead', 400);

  return await tripRepository.removeMember(tripId, userId);
};

const calculateBalances = async (tripId, userId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isMember = trip.members.some(m => m.userId === userId);
  if (!isMember) throw new AppError('Access denied', 403);

  const expenses = await tripRepository.getExpenses(tripId);
  const balances = {};
  
  // Initialize balances for all members
  trip.members.forEach(member => {
    balances[member.userId] = {
      userId: member.userId,
      name: member.user.name,
      paid: 0,
      owed: 0,
      netBalance: 0
    };
  });

  // Calculate paid amounts and owed amounts
  expenses.forEach(expense => {
    const paidAmount = parseFloat(expense.amount);
    
    // Add to paid amount
    if (balances[expense.paidById]) {
      balances[expense.paidById].paid += paidAmount;
    }
    
    // Add to owed amounts
    expense.splits.forEach(split => {
      const owedAmount = parseFloat(split.amount);
      if (balances[split.userId]) {
        balances[split.userId].owed += owedAmount;
      }
    });
  });

  // Calculate net balances (positive = owed money, negative = owes money)
  Object.values(balances).forEach(balance => {
    balance.netBalance = balance.paid - balance.owed;
    balance.paid = Number(balance.paid.toFixed(2));
    balance.owed = Number(balance.owed.toFixed(2));
    balance.netBalance = Number(balance.netBalance.toFixed(2));
  });

  return Object.values(balances);
};

const calculateSuggestedPayments = async (tripId, userId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);

  const isMember = trip.members.some(m => m.userId === userId);
  if (!isMember) throw new AppError('Access denied', 403);

  const balances = await calculateBalances(tripId, userId);
  
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances.filter(b => b.netBalance > 0).sort((a, b) => b.netBalance - a.netBalance);
  const debtors = balances.filter(b => b.netBalance < 0).sort((a, b) => a.netBalance - b.netBalance);
  
  const payments = [];
  let i = 0, j = 0;
  
  // Greedy algorithm: match largest creditor with largest debtor
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const paymentAmount = Math.min(creditor.netBalance, Math.abs(debtor.netBalance));
    
    if (paymentAmount > 0.01) { // Ignore very small amounts
      payments.push({
        from: {
          userId: debtor.userId,
          name: debtor.name
        },
        to: {
          userId: creditor.userId,
          name: creditor.name
        },
        amount: Number(paymentAmount.toFixed(2))
      });
    }
    
    creditor.netBalance -= paymentAmount;
    debtor.netBalance += paymentAmount;
    
    if (creditor.netBalance <= 0.01) i++;
    if (Math.abs(debtor.netBalance) <= 0.01) j++;
  }
  
  return payments;
};

module.exports = { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip, 
  addMember, 
  removeMember, 
  calculateBalances,
  calculateSuggestedPayments
};
