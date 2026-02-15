# TripMate Database Schema

## Overview
PostgreSQL database with Prisma ORM for managing trip expenses and settlements.

## Models

### User
Stores user account information.

| Field      | Type     | Constraints           | Description                |
|------------|----------|-----------------------|----------------------------|
| id         | UUID     | PK, Default uuid()    | Unique user identifier     |
| email      | String   | Unique, Indexed       | User email (login)         |
| password   | String   | Required              | Hashed password (bcrypt)   |
| name       | String   | Required              | User display name          |
| createdAt  | DateTime | Default now()         | Account creation timestamp |
| updatedAt  | DateTime | Auto-updated          | Last update timestamp      |

**Relations:**
- `trips` → TripMember[] (trips user is member of)
- `expenses` → Expense[] (expenses paid by user)
- `paymentsFrom` → Settlement[] (settlements user owes)
- `paymentsTo` → Settlement[] (settlements owed to user)

---

### Trip
Represents a trip/group for expense tracking.

| Field       | Type     | Constraints           | Description                |
|-------------|----------|-----------------------|----------------------------|
| id          | UUID     | PK, Default uuid()    | Unique trip identifier     |
| name        | String   | Required              | Trip name                  |
| description | String   | Optional              | Trip description           |
| currency    | String   | Default "USD"         | Currency code (USD, EUR)   |
| createdAt   | DateTime | Default now(), Indexed| Trip creation timestamp    |
| updatedAt   | DateTime | Auto-updated          | Last update timestamp      |

**Relations:**
- `members` → TripMember[] (trip participants)
- `expenses` → Expense[] (trip expenses)
- `settlements` → Settlement[] (trip settlements)

---

### TripMember
Junction table for User-Trip many-to-many relationship.

| Field    | Type     | Constraints                    | Description                |
|----------|----------|--------------------------------|----------------------------|
| id       | UUID     | PK, Default uuid()             | Unique member identifier   |
| userId   | UUID     | FK → User.id, Indexed          | Reference to user          |
| tripId   | UUID     | FK → Trip.id, Indexed          | Reference to trip          |
| role     | String   | Default "member"               | Role: admin/member         |
| joinedAt | DateTime | Default now()                  | Join timestamp             |

**Constraints:**
- Unique: (userId, tripId) - prevents duplicate memberships
- Cascade delete: deletes when user or trip is deleted

---

### Expense
Tracks individual expenses within a trip.

| Field       | Type     | Constraints                    | Description                |
|-------------|----------|--------------------------------|----------------------------|
| id          | UUID     | PK, Default uuid()             | Unique expense identifier  |
| tripId      | UUID     | FK → Trip.id, Indexed          | Reference to trip          |
| paidById    | UUID     | FK → User.id, Indexed          | User who paid              |
| description | String   | Required                       | Expense description        |
| amount      | Decimal  | Decimal(10,2)                  | Total amount paid          |
| category    | String   | Optional                       | Category (Food, Transport) |
| date        | DateTime | Default now(), Indexed         | Expense date               |
| createdAt   | DateTime | Default now()                  | Creation timestamp         |
| updatedAt   | DateTime | Auto-updated                   | Last update timestamp      |

**Relations:**
- `trip` → Trip (expense belongs to trip)
- `paidBy` → User (user who paid)
- `splits` → ExpenseSplit[] (how expense is split)

**Indexes:**
- tripId (for filtering expenses by trip)
- paidById (for user expense queries)
- date (for chronological sorting)

---

### ExpenseSplit
Defines how an expense is split among users.

| Field     | Type    | Constraints                    | Description                |
|-----------|---------|--------------------------------|----------------------------|
| id        | UUID    | PK, Default uuid()             | Unique split identifier    |
| expenseId | UUID    | FK → Expense.id, Indexed       | Reference to expense       |
| userId    | UUID    | Indexed                        | User responsible for split |
| amount    | Decimal | Decimal(10,2)                  | Amount user owes           |

**Constraints:**
- Unique: (expenseId, userId) - one split per user per expense
- Cascade delete: deletes when expense is deleted

**Business Rule:**
Sum of all splits.amount for an expense must equal expense.amount

---

### Settlement
Tracks payments between users to settle balances.

| Field      | Type     | Constraints                    | Description                |
|------------|----------|--------------------------------|----------------------------|
| id         | UUID     | PK, Default uuid()             | Unique settlement ID       |
| tripId     | UUID     | FK → Trip.id, Indexed          | Reference to trip          |
| payerId    | UUID     | FK → User.id, Indexed          | User making payment        |
| receiverId | UUID     | FK → User.id, Indexed          | User receiving payment     |
| amount     | Decimal  | Decimal(10,2)                  | Settlement amount          |
| settled    | Boolean  | Default false, Indexed         | Payment completed flag     |
| settledAt  | DateTime | Optional                       | Settlement timestamp       |
| createdAt  | DateTime | Default now()                  | Creation timestamp         |
| updatedAt  | DateTime | Auto-updated                   | Last update timestamp      |

**Relations:**
- `trip` → Trip (settlement belongs to trip)
- `payer` → User (user paying)
- `receiver` → User (user receiving)

**Indexes:**
- tripId, payerId, receiverId (for balance queries)
- settled (for filtering unsettled payments)

---

## Relationships Diagram

```
User ←→ TripMember ←→ Trip
 ↓                      ↓
Expense ←→ ExpenseSplit
 ↓
User (paidBy)

User ←→ Settlement ←→ User
         ↓
        Trip
```

## Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems, no collision risk
2. **Decimal for Money**: Precise decimal arithmetic (no floating point errors)
3. **Cascade Deletes**: Automatic cleanup of related records
4. **Indexes**: Optimized for common queries (trip expenses, user balances)
5. **Timestamps**: Automatic tracking with createdAt/updatedAt
6. **Soft Delete**: Not implemented (can add deletedAt field if needed)

## Common Queries

### Get Trip with Members and Expenses
```javascript
const trip = await prisma.trip.findUnique({
  where: { id: tripId },
  include: {
    members: { include: { user: true } },
    expenses: { include: { splits: true, paidBy: true } }
  }
});
```

### Calculate User Balance in Trip
```javascript
const expenses = await prisma.expense.findMany({
  where: { tripId },
  include: { splits: true }
});

// Calculate: amount paid - amount owed
```

### Get User's Trips
```javascript
const trips = await prisma.trip.findMany({
  where: { members: { some: { userId } } },
  include: { members: true }
});
```
