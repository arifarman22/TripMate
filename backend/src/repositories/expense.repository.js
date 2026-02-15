const prisma = require('../config/database');

const create = async (expenseData, splits) => {
  return await prisma.$transaction(async (tx) => {
    const expense = await tx.expense.create({
      data: expenseData,
      include: { paidBy: { select: { name: true } } }
    });

    const splitData = splits.map(split => ({
      expenseId: expense.id,
      userId: split.userId,
      amount: split.amount
    }));

    await tx.expenseSplit.createMany({ data: splitData });

    return await tx.expense.findUnique({
      where: { id: expense.id },
      include: {
        paidBy: { select: { id: true, name: true } },
        splits: true
      }
    });
  });
};

const findById = async (id) => {
  return await prisma.expense.findUnique({
    where: { id },
    include: {
      paidBy: { select: { id: true, name: true } },
      splits: true
    }
  });
};

const findByTripId = async (tripId) => {
  return await prisma.expense.findMany({
    where: { tripId },
    include: {
      paidBy: { select: { name: true, email: true } },
      splits: true
    },
    orderBy: { date: 'desc' }
  });
};

const update = async (id, expenseData, splits) => {
  return await prisma.$transaction(async (tx) => {
    const expense = await tx.expense.update({
      where: { id },
      data: expenseData
    });

    if (splits) {
      await tx.expenseSplit.deleteMany({ where: { expenseId: id } });
      
      const splitData = splits.map(split => ({
        expenseId: id,
        userId: split.userId,
        amount: split.amount
      }));

      await tx.expenseSplit.createMany({ data: splitData });
    }

    return await tx.expense.findUnique({
      where: { id },
      include: {
        paidBy: { select: { id: true, name: true } },
        splits: true
      }
    });
  });
};

const deleteExpense = async (id) => {
  return await prisma.$transaction(async (tx) => {
    await tx.expenseSplit.deleteMany({ where: { expenseId: id } });
    return await tx.expense.delete({ where: { id } });
  });
};

module.exports = { create, findById, findByTripId, update, deleteExpense };
