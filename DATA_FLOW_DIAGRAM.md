# 🌊 TripMate Complete Data Flow Visualization

## 📊 System Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend   │ ◄─────► │  Database   │
│  (React +   │  HTTP   │  (Express   │   SQL   │ (PostgreSQL)│
│   Vite)     │  REST   │   + Prisma) │         │    Neon     │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
   Port 5174              Port 5000              Cloud Hosted
```

---

## 🔄 Complete Trip Lifecycle Data Flow

### 1️⃣ USER REGISTRATION & AUTHENTICATION

```
┌──────────┐
│  User    │
│ Browser  │
└────┬─────┘
     │
     │ 1. POST /api/auth/register
     │    { email, password, name }
     ▼
┌─────────────────────────────────┐
│  Frontend (AuthContext)         │
│  - Validates input              │
│  - Calls authService.register() │
└────┬────────────────────────────┘
     │
     │ 2. HTTP Request with JSON
     ▼
┌─────────────────────────────────┐
│  Backend (auth.controller.js)   │
│  - Receives request             │
│  - Calls authService.register() │
└────┬────────────────────────────┘
     │
     │ 3. Business Logic
     ▼
┌─────────────────────────────────┐
│  Backend (auth.service.js)      │
│  - Checks if email exists       │
│  - Hashes password (bcrypt)     │
│  - Calls userRepository.create()│
└────┬────────────────────────────┘
     │
     │ 4. Database Query
     ▼
┌─────────────────────────────────┐
│  Backend (user.repository.js)   │
│  - prisma.user.create()         │
└────┬────────────────────────────┘
     │
     │ 5. SQL INSERT
     ▼
┌─────────────────────────────────┐
│  Database (users table)         │
│  INSERT INTO users              │
│  (id, email, password, name)    │
└────┬────────────────────────────┘
     │
     │ 6. Returns user record
     ▼
┌─────────────────────────────────┐
│  Backend (auth.service.js)      │
│  - Generates JWT token          │
│  - Returns { user, token }      │
└────┬────────────────────────────┘
     │
     │ 7. HTTP Response
     ▼
┌─────────────────────────────────┐
│  Frontend (AuthContext)         │
│  - Stores token in localStorage │
│  - Stores user in state         │
│  - Redirects to dashboard       │
└─────────────────────────────────┘
```

**Database State After Registration:**
```sql
users table:
┌──────────┬───────────────────┬──────────────┬───────────┐
│ id       │ email             │ password     │ name      │
├──────────┼───────────────────┼──────────────┼───────────┤
│ uuid-123 │ user@example.com  │ $2a$10$...  │ John Doe  │
└──────────┴───────────────────┴──────────────┴───────────┘
```

---

### 2️⃣ TRIP CREATION

```
┌──────────┐
│  User    │
│ Clicks   │
│ "Create  │
│  Trip"   │
└────┬─────┘
     │
     │ 1. Opens CreateTripModal
     │    Fills form: name, budget, dates, currency
     ▼
┌─────────────────────────────────┐
│  Frontend (CreateTripModal)     │
│  - Validates form data          │
│  - Calls tripService.createTrip()│
└────┬────────────────────────────┘
     │
     │ 2. POST /api/trips
     │    Headers: { Authorization: Bearer TOKEN }
     │    Body: { name, description, currency, budget, dates }
     ▼
┌─────────────────────────────────┐
│  Backend (auth middleware)      │
│  - Verifies JWT token           │
│  - Extracts user ID             │
│  - Attaches to req.user         │
└────┬────────────────────────────┘
     │
     │ 3. Authenticated request
     ▼
┌─────────────────────────────────┐
│  Backend (trip.controller.js)   │
│  - Receives request             │
│  - Calls tripService.createTrip()│
│  - Passes userId and tripData   │
└────┬────────────────────────────┘
     │
     │ 4. Business Logic
     ▼
┌─────────────────────────────────┐
│  Backend (trip.service.js)      │
│  - Validates trip data          │
│  - Calls tripRepository.create()│
│  - Then adds creator as admin   │
└────┬────────────────────────────┘
     │
     │ 5. Database Operations
     ▼
┌─────────────────────────────────┐
│  Backend (trip.repository.js)   │
│  Step 1: prisma.trip.create()   │
│  Step 2: prisma.tripMember.create()│
└────┬────────────────────────────┘
     │
     │ 6. SQL Transactions
     ▼
┌─────────────────────────────────┐
│  Database                       │
│  Transaction Start:             │
│  1. INSERT INTO trips           │
│  2. INSERT INTO trip_members    │
│  Transaction Commit             │
└────┬────────────────────────────┘
     │
     │ 7. Returns trip with members
     ▼
┌─────────────────────────────────┐
│  Frontend (TripsPage)           │
│  - Adds trip to state           │
│  - Closes modal                 │
│  - Shows success toast          │
│  - Displays new trip card       │
└─────────────────────────────────┘
```

**Database State After Trip Creation:**
```sql
trips table:
┌──────────┬─────────────┬─────────┬────────┬────────────┬──────────┐
│ id       │ name        │ currency│ budget │ startDate  │ endDate  │
├──────────┼─────────────┼─────────┼────────┼────────────┼──────────┤
│ trip-001 │ Cox's Bazar │ BDT     │ 50000  │ 2024-03-01 │ 2024-03-03│
└──────────┴─────────────┴─────────┴────────┴────────────┴──────────┘

trip_members table:
┌──────────┬──────────┬──────────┬───────┬────────────────────┐
│ id       │ tripId   │ userId   │ role  │ joinedAt           │
├──────────┼──────────┼──────────┼───────┼────────────────────┤
│ mem-001  │ trip-001 │ uuid-123 │ admin │ 2024-02-15 10:00:00│
└──────────┴──────────┴──────────┴───────┴────────────────────┘
```

---

### 3️⃣ INVITING MEMBERS

```
┌──────────┐
│  Admin   │
│ Clicks   │
│ "Invite  │
│ Member"  │
└────┬─────┘
     │
     │ 1. Opens InviteMemberModal
     │    Enters: friend@example.com
     ▼
┌─────────────────────────────────┐
│  Frontend (InviteMemberModal)   │
│  - Validates email format       │
│  - Calls tripService.addMember()│
└────┬────────────────────────────┘
     │
     │ 2. POST /api/trips/:id/members
     │    Headers: { Authorization: Bearer TOKEN }
     │    Body: { email: "friend@example.com" }
     ▼
┌─────────────────────────────────┐
│  Backend (tripAccess middleware)│
│  - Verifies user is trip member │
│  - Checks if user is admin      │
└────┬────────────────────────────┘
     │
     │ 3. Authorized request
     ▼
┌─────────────────────────────────┐
│  Backend (trip.service.js)      │
│  - Finds user by email          │
│  - Checks if already member     │
│  - Adds to trip_members         │
└────┬────────────────────────────┘
     │
     │ 4. Database Queries
     ▼
┌─────────────────────────────────┐
│  Database                       │
│  1. SELECT * FROM users         │
│     WHERE email = ?             │
│  2. SELECT * FROM trip_members  │
│     WHERE userId = ? AND tripId = ?│
│  3. INSERT INTO trip_members    │
└────┬────────────────────────────┘
     │
     │ 5. Returns new member
     ▼
┌─────────────────────────────────┐
│  Frontend (TripDetailPage)      │
│  - Updates members list         │
│  - Shows success toast          │
│  - Member appears in Members tab│
└─────────────────────────────────┘
```

**Database State After Invitation:**
```sql
trip_members table:
┌──────────┬──────────┬──────────┬────────┬────────────────────┐
│ id       │ tripId   │ userId   │ role   │ joinedAt           │
├──────────┼──────────┼──────────┼────────┼────────────────────┤
│ mem-001  │ trip-001 │ uuid-123 │ admin  │ 2024-02-15 10:00:00│
│ mem-002  │ trip-001 │ uuid-456 │ member │ 2024-02-15 10:30:00│
│ mem-003  │ trip-001 │ uuid-789 │ member │ 2024-02-15 10:35:00│
└──────────┴──────────┴──────────┴────────┴────────────────────┘
```

---

### 4️⃣ ADDING EXPENSE

```
┌──────────┐
│  Member  │
│ Clicks   │
│ "Add     │
│ Expense" │
└────┬─────┘
     │
     │ 1. Opens AddExpenseModal
     │    Fills: description, amount, category
     │    Selects: members to split with
     │    Chooses: equal or custom split
     ▼
┌─────────────────────────────────┐
│  Frontend (AddExpenseModal)     │
│  - Validates amount > 0         │
│  - Calculates split amounts     │
│  - Calls expenseService.create()│
└────┬────────────────────────────┘
     │
     │ 2. POST /api/trips/:tripId/expenses
     │    Body: {
     │      description: "Hotel booking",
     │      amount: 12000,
     │      category: "Accommodation",
     │      splitType: "equal",
     │      splits: [
     │        { userId: "uuid-123" },
     │        { userId: "uuid-456" },
     │        { userId: "uuid-789" }
     │      ]
     │    }
     ▼
┌─────────────────────────────────┐
│  Backend (expense.service.js)   │
│  - Validates trip membership    │
│  - Calculates split amounts     │
│  - Creates expense record       │
│  - Creates split records        │
└────┬────────────────────────────┘
     │
     │ 3. Database Transaction
     ▼
┌─────────────────────────────────┐
│  Database                       │
│  Transaction Start:             │
│  1. INSERT INTO expenses        │
│     (tripId, paidById, amount,  │
│      description, category)     │
│  2. INSERT INTO expense_splits  │
│     (expenseId, userId, amount) │
│     × 3 records                 │
│  Transaction Commit             │
└────┬────────────────────────────┘
     │
     │ 4. Returns expense with splits
     ▼
┌─────────────────────────────────┐
│  Frontend (TripDetailPage)      │
│  - Adds expense to list         │
│  - Refreshes balances           │
│  - Shows success toast          │
│  - Updates user balance card    │
└─────────────────────────────────┘
```

**Database State After Expense:**
```sql
expenses table:
┌──────────┬──────────┬──────────┬─────────────┬────────┬──────────────┐
│ id       │ tripId   │ paidById │ description │ amount │ category     │
├──────────┼──────────┼──────────┼─────────────┼────────┼──────────────┤
│ exp-001  │ trip-001 │ uuid-123 │ Hotel book  │ 12000  │ Accommodation│
└──────────┴──────────┴──────────┴─────────────┴────────┴──────────────┘

expense_splits table:
┌──────────┬──────────┬──────────┬────────┐
│ id       │ expenseId│ userId   │ amount │
├──────────┼──────────┼──────────┼────────┤
│ spl-001  │ exp-001  │ uuid-123 │ 4000   │
│ spl-002  │ exp-001  │ uuid-456 │ 4000   │
│ spl-003  │ exp-001  │ uuid-789 │ 4000   │
└──────────┴──────────┴──────────┴────────┘
```

---

### 5️⃣ VIEWING BALANCES

```
┌──────────┐
│  Member  │
│ Views    │
│ Balances │
│ Tab      │
└────┬─────┘
     │
     │ 1. Clicks "Balances" tab
     ▼
┌─────────────────────────────────┐
│  Frontend (TripDetailPage)      │
│  - Calls tripService.getBalances()│
│  - Calls tripService.getUserBalance()│
└────┬────────────────────────────┘
     │
     │ 2. Parallel API Calls:
     │    GET /api/trips/:id/balances
     │    GET /api/trips/:id/my-balance
     ▼
┌─────────────────────────────────┐
│  Backend (trip.service.js)      │
│  calculateBalances():           │
│  1. Fetch all expenses          │
│  2. For each member:            │
│     - Sum expenses paid         │
│     - Sum expense splits owed   │
│     - Calculate net balance     │
└────┬────────────────────────────┘
     │
     │ 3. Complex SQL Queries
     ▼
┌─────────────────────────────────┐
│  Database                       │
│  Query 1: Get all expenses      │
│  SELECT * FROM expenses         │
│  WHERE tripId = ?               │
│  INCLUDE expense_splits         │
│                                 │
│  Query 2: Aggregate by user     │
│  - SUM(amount) WHERE paidById   │
│  - SUM(split.amount) WHERE userId│
└────┬────────────────────────────┘
     │
     │ 4. Calculation in Memory
     ▼
┌─────────────────────────────────┐
│  Backend (trip.service.js)      │
│  For uuid-123:                  │
│    paid = 12000 (1 expense)     │
│    owed = 4000 (1 split)        │
│    net = +8000 (owed money)     │
│                                 │
│  For uuid-456:                  │
│    paid = 0                     │
│    owed = 4000                  │
│    net = -4000 (owes money)     │
│                                 │
│  For uuid-789:                  │
│    paid = 0                     │
│    owed = 4000                  │
│    net = -4000 (owes money)     │
└────┬────────────────────────────┘
     │
     │ 5. Returns balance data
     ▼
┌─────────────────────────────────┐
│  Frontend (BalanceSummary)      │
│  - Displays all member balances │
│  - Color codes: green/red/gray  │
│  - Shows who owes whom          │
│                                 │
│  Frontend (UserBalanceCard)     │
│  - Highlights user's balance    │
│  - Shows paid vs owed           │
│  - Displays status badge        │
└─────────────────────────────────┘
```

**Balance Calculation Example:**
```
Trip: Cox's Bazar (3 members)
Expenses:
  1. John paid 12000 BDT (Hotel) → split equally among 3
  2. Jane paid 3000 BDT (Food) → split equally among 3

Calculation:
┌──────┬───────┬───────┬────────┬────────┐
│ User │ Paid  │ Owed  │ Net    │ Status │
├──────┼───────┼───────┼────────┼────────┤
│ John │ 12000 │ 5000  │ +7000  │ Owed   │
│ Jane │ 3000  │ 5000  │ -2000  │ Owes   │
│ Bob  │ 0     │ 5000  │ -5000  │ Owes   │
└──────┴───────┴───────┴────────┴────────┘

Settlement Suggestions:
  Bob pays John 5000 BDT
  Jane pays John 2000 BDT
  → All balanced!
```

---

### 6️⃣ SUGGESTED PAYMENTS (Greedy Algorithm)

```
┌─────────────────────────────────┐
│  Backend (trip.service.js)      │
│  calculateSuggestedPayments()   │
└────┬────────────────────────────┘
     │
     │ 1. Get all balances
     ▼
┌─────────────────────────────────┐
│  Separate creditors & debtors   │
│  Creditors (positive balance):  │
│    John: +7000                  │
│  Debtors (negative balance):    │
│    Bob: -5000                   │
│    Jane: -2000                  │
└────┬────────────────────────────┘
     │
     │ 2. Sort both arrays
     ▼
┌─────────────────────────────────┐
│  Creditors (desc): [John: 7000] │
│  Debtors (asc): [Bob: -5000,    │
│                  Jane: -2000]   │
└────┬────────────────────────────┘
     │
     │ 3. Greedy matching
     ▼
┌─────────────────────────────────┐
│  Iteration 1:                   │
│    Largest creditor: John (7000)│
│    Largest debtor: Bob (-5000)  │
│    Payment: Bob → John: 5000    │
│    John remaining: 2000         │
│    Bob settled: 0               │
└────┬────────────────────────────┘
     │
     │ 4. Continue matching
     ▼
┌─────────────────────────────────┐
│  Iteration 2:                   │
│    Largest creditor: John (2000)│
│    Largest debtor: Jane (-2000) │
│    Payment: Jane → John: 2000   │
│    John settled: 0              │
│    Jane settled: 0              │
└────┬────────────────────────────┘
     │
     │ 5. Return payment plan
     ▼
┌─────────────────────────────────┐
│  Result: 2 transactions         │
│  [                              │
│    { from: Bob, to: John, amt: 5000 },│
│    { from: Jane, to: John, amt: 2000 }│
│  ]                              │
│  Instead of potentially more!   │
└─────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
Every API Request:

┌──────────────┐
│   Frontend   │
│   Request    │
└──────┬───────┘
       │
       │ Headers: {
       │   Authorization: "Bearer eyJhbGc..."
       │ }
       ▼
┌──────────────────────────────────┐
│  Backend (auth middleware)       │
│  1. Extract token from header    │
│  2. Verify JWT signature         │
│  3. Decode payload               │
│  4. Extract user ID              │
│  5. Attach to req.user           │
└──────┬───────────────────────────┘
       │
       │ If valid → Continue
       │ If invalid → 401 Unauthorized
       ▼
┌──────────────────────────────────┐
│  Backend (tripAccess middleware) │
│  1. Get tripId from params       │
│  2. Query trip_members table     │
│  3. Check if req.user.id exists  │
│  4. Verify role if needed        │
└──────┬───────────────────────────┘
       │
       │ If member → Continue
       │ If not member → 403 Forbidden
       ▼
┌──────────────────────────────────┐
│  Controller executes             │
│  Business logic runs             │
│  Response sent                   │
└──────────────────────────────────┘
```

---

## 📱 Frontend State Management

```
┌─────────────────────────────────┐
│  App.jsx (Root)                 │
│  - AuthContext Provider         │
│  - ErrorContext Provider        │
│  - React Router                 │
└────┬────────────────────────────┘
     │
     ├─► AuthContext
     │   - user: { id, email, name }
     │   - token: "jwt-token"
     │   - login(), logout()
     │   - Persists to localStorage
     │
     ├─► TripDetailPage
     │   - trip: Trip object
     │   - expenses: Expense[]
     │   - balances: Balance[]
     │   - userBalance: UserBalance
     │   - Fetches on mount
     │   - Refreshes on changes
     │
     └─► Components
         - AddExpenseModal
         - InviteMemberModal
         - UserBalanceCard
         - MembersList
         - ExpenseList
```

---

## 🗄️ Database Schema Relationships

```
┌──────────────┐
│    users     │
│──────────────│
│ id (PK)      │◄─────┐
│ email        │      │
│ password     │      │
│ name         │      │
└──────────────┘      │
                      │
                      │ userId (FK)
                      │
┌──────────────┐      │
│    trips     │      │
│──────────────│      │
│ id (PK)      │◄──┐  │
│ name         │   │  │
│ currency     │   │  │
│ budget       │   │  │
└──────────────┘   │  │
                   │  │
         tripId (FK)│  │
                   │  │
┌──────────────────┼──┼──┐
│  trip_members    │  │  │
│──────────────────│  │  │
│ id (PK)          │  │  │
│ tripId (FK)      ├──┘  │
│ userId (FK)      ├─────┘
│ role             │
└──────────────────┘

┌──────────────┐
│   expenses   │
│──────────────│
│ id (PK)      │◄─────┐
│ tripId (FK)  │      │
│ paidById (FK)│      │
│ amount       │      │
│ description  │      │
└──────────────┘      │
                      │ expenseId (FK)
                      │
┌──────────────────────┼──┐
│  expense_splits      │  │
│──────────────────────│  │
│ id (PK)              │  │
│ expenseId (FK)       ├──┘
│ userId (FK)          │
│ amount               │
└──────────────────────┘
```

---

## ✅ API Response Status Codes

```
200 OK              - Successful GET, PUT
201 Created         - Successful POST
400 Bad Request     - Validation error
401 Unauthorized    - Invalid/missing token
403 Forbidden       - Not authorized for action
404 Not Found       - Resource doesn't exist
500 Server Error    - Internal server error
```

---

## 🚀 To Test All APIs:

1. **Start Backend:**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend && npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:5000

4. **Test Flow:**
   - Register → Login → Create Trip → Invite Members → Add Expenses → View Balances

All APIs are working and integrated! 🎉
