const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password: hashedPassword,
      name: 'Alice Johnson'
    }
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob Smith'
    }
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      password: hashedPassword,
      name: 'Charlie Brown'
    }
  });

  console.log('✅ Users created');

  // Create trip
  const trip = await prisma.trip.create({
    data: {
      name: 'Tokyo Adventure 2024',
      description: 'Spring trip to Tokyo with friends',
      currency: 'USD',
      members: {
        create: [
          { userId: alice.id, role: 'admin' },
          { userId: bob.id, role: 'member' },
          { userId: charlie.id, role: 'member' }
        ]
      }
    }
  });

  console.log('✅ Trip created');

  // Create expenses
  const expense1 = await prisma.expense.create({
    data: {
      tripId: trip.id,
      paidById: alice.id,
      description: 'Hotel booking',
      amount: 450.00,
      category: 'Accommodation',
      splits: {
        create: [
          { userId: alice.id, amount: 150.00 },
          { userId: bob.id, amount: 150.00 },
          { userId: charlie.id, amount: 150.00 }
        ]
      }
    }
  });

  const expense2 = await prisma.expense.create({
    data: {
      tripId: trip.id,
      paidById: bob.id,
      description: 'Dinner at Sushi Restaurant',
      amount: 120.00,
      category: 'Food',
      splits: {
        create: [
          { userId: alice.id, amount: 40.00 },
          { userId: bob.id, amount: 40.00 },
          { userId: charlie.id, amount: 40.00 }
        ]
      }
    }
  });

  const expense3 = await prisma.expense.create({
    data: {
      tripId: trip.id,
      paidById: charlie.id,
      description: 'Train tickets',
      amount: 90.00,
      category: 'Transportation',
      splits: {
        create: [
          { userId: alice.id, amount: 30.00 },
          { userId: bob.id, amount: 30.00 },
          { userId: charlie.id, amount: 30.00 }
        ]
      }
    }
  });

  console.log('✅ Expenses created');

  // Create settlements
  await prisma.settlement.create({
    data: {
      tripId: trip.id,
      payerId: bob.id,
      receiverId: alice.id,
      amount: 110.00,
      settled: false
    }
  });

  await prisma.settlement.create({
    data: {
      tripId: trip.id,
      payerId: charlie.id,
      receiverId: alice.id,
      amount: 120.00,
      settled: true,
      settledAt: new Date()
    }
  });

  console.log('✅ Settlements created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
