# TripMate API Endpoints & Data Flow Documentation

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  }
}
```

### 2. Login User
**POST** `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  }
}
```

---

## 🗺️ Trip Management Endpoints

### 3. Create Trip (Admin Only)
**POST** `/api/trips`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "name": "Cox's Bazar Trip",
  "description": "Weekend beach trip",
  "currency": "BDT",
  "budget": 50000,
  "startDate": "2024-03-01",
  "endDate": "2024-03-03"
}

Response:
{
  "success": true,
  "data": {
    "id": "trip-uuid",
    "name": "Cox's Bazar Trip",
    "description": "Weekend beach trip",
    "currency": "BDT",
    "budget": 50000,
    "startDate": "2024-03-01T00:00:00.000Z",
    "endDate": "2024-03-03T00:00:00.000Z",
    "createdAt": "2024-02-15T10:00:00.000Z",
    "updatedAt": "2024-02-15T10:00:00.000Z",
    "members": [
      {
        "id": "member-uuid",
        "userId": "user-uuid",
        "tripId": "trip-uuid",
        "role": "admin",
        "joinedAt": "2024-02-15T10:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "user@example.com"
        }
      }
    ],
    "expenses": []
  }
}
```

### 4. Get User's Trips
**GET** `/api/trips`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "trip-uuid",
      "name": "Cox's Bazar Trip",
      "description": "Weekend beach trip",
      "currency": "BDT",
      "budget": 50000,
      "startDate": "2024-03-01T00:00:00.000Z",
      "endDate": "2024-03-03T00:00:00.000Z",
      "createdAt": "2024-02-15T10:00:00.000Z",
      "members": [
        {
          "user": {
            "name": "John Doe"
          }
        }
      ]
    }
  ]
}
```

### 5. Get Trip by ID (Members Only)
**GET** `/api/trips/:id`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": {
    "id": "trip-uuid",
    "name": "Cox's Bazar Trip",
    "description": "Weekend beach trip",
    "currency": "BDT",
    "budget": 50000,
    "members": [...],
    "expenses": [...]
  }
}
```

### 6. Update Trip (Admin Only)
**PUT** `/api/trips/:id`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "name": "Updated Trip Name",
  "budget": 60000
}

Response:
{
  "success": true,
  "data": {
    "id": "trip-uuid",
    "name": "Updated Trip Name",
    "budget": 60000,
    ...
  }
}
```

### 7. Delete Trip (Admin Only)
**DELETE** `/api/trips/:id`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

---

## 👥 Member Management Endpoints

### 8. Invite Member (Admin Only)
**POST** `/api/trips/:id/members`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "email": "friend@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "userId": "friend-user-uuid",
    "tripId": "trip-uuid",
    "role": "member",
    "joinedAt": "2024-02-15T10:30:00.000Z",
    "user": {
      "id": "friend-user-uuid",
      "name": "Friend Name",
      "email": "friend@example.com"
    }
  }
}
```

### 9. Remove Member (Admin Only)
**DELETE** `/api/trips/:id/members`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "userId": "member-user-uuid"
}

Response:
{
  "success": true,
  "message": "Member removed successfully"
}
```

---

## 💰 Expense Management Endpoints

### 10. Add Expense (Members)
**POST** `/api/trips/:tripId/expenses`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "description": "Hotel booking",
  "amount": 12000,
  "category": "Accommodation",
  "date": "2024-03-01",
  "splitType": "equal",
  "splits": [
    { "userId": "user1-uuid" },
    { "userId": "user2-uuid" },
    { "userId": "user3-uuid" }
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "tripId": "trip-uuid",
    "paidById": "current-user-uuid",
    "description": "Hotel booking",
    "amount": 12000,
    "category": "Accommodation",
    "date": "2024-03-01T00:00:00.000Z",
    "createdAt": "2024-02-15T11:00:00.000Z",
    "splits": [
      {
        "id": "split1-uuid",
        "expenseId": "expense-uuid",
        "userId": "user1-uuid",
        "amount": 4000
      },
      {
        "id": "split2-uuid",
        "expenseId": "expense-uuid",
        "userId": "user2-uuid",
        "amount": 4000
      },
      {
        "id": "split3-uuid",
        "expenseId": "expense-uuid",
        "userId": "user3-uuid",
        "amount": 4000
      }
    ]
  }
}
```

### 11. Get Trip Expenses (Members)
**GET** `/api/trips/:tripId/expenses`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "expense-uuid",
      "description": "Hotel booking",
      "amount": 12000,
      "category": "Accommodation",
      "date": "2024-03-01T00:00:00.000Z",
      "paidBy": {
        "name": "John Doe"
      },
      "splits": [...]
    }
  ]
}
```

### 12. Update Expense
**PUT** `/api/expenses/:id`
**Headers:** `Authorization: Bearer {token}`
```json
Request:
{
  "description": "Updated description",
  "amount": 13000
}

Response:
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "description": "Updated description",
    "amount": 13000,
    ...
  }
}
```

### 13. Delete Expense
**DELETE** `/api/expenses/:id`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

## 📊 Balance & Settlement Endpoints

### 14. Get All Balances (Members)
**GET** `/api/trips/:id/balances`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": [
    {
      "userId": "user1-uuid",
      "name": "John Doe",
      "paid": 12000,
      "owed": 4000,
      "netBalance": 8000
    },
    {
      "userId": "user2-uuid",
      "name": "Jane Smith",
      "paid": 0,
      "owed": 4000,
      "netBalance": -4000
    },
    {
      "userId": "user3-uuid",
      "name": "Bob Wilson",
      "paid": 0,
      "owed": 4000,
      "netBalance": -4000
    }
  ]
}
```

### 15. Get User's Own Balance (Members)
**GET** `/api/trips/:id/my-balance`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": {
    "userId": "current-user-uuid",
    "totalPaid": 12000,
    "totalOwed": 4000,
    "netBalance": 8000,
    "expensesPaid": 1,
    "status": "owed"
  }
}
```

### 16. Get Suggested Payments (Members)
**GET** `/api/trips/:id/suggested-payments`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": [
    {
      "from": {
        "userId": "user2-uuid",
        "name": "Jane Smith"
      },
      "to": {
        "userId": "user1-uuid",
        "name": "John Doe"
      },
      "amount": 4000
    },
    {
      "from": {
        "userId": "user3-uuid",
        "name": "Bob Wilson"
      },
      "to": {
        "userId": "user1-uuid",
        "name": "John Doe"
      },
      "amount": 4000
    }
  ]
}
```

---

## 🔔 Notification Endpoints

### 17. Get User Notifications
**GET** `/api/notifications`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "notif-uuid",
      "userId": "user-uuid",
      "type": "expense_added",
      "title": "New Expense Added",
      "message": "John Doe added an expense: Hotel booking",
      "data": "{\"tripId\":\"trip-uuid\",\"expenseId\":\"expense-uuid\"}",
      "read": false,
      "createdAt": "2024-02-15T11:00:00.000Z"
    }
  ]
}
```

### 18. Mark Notification as Read
**PUT** `/api/notifications/:id/read`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "data": {
    "id": "notif-uuid",
    "read": true
  }
}
```

### 19. Mark All Notifications as Read
**PUT** `/api/notifications/mark-all-read`
**Headers:** `Authorization: Bearer {token}`
```json
Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## 📈 Complete Data Flow: Trip Lifecycle

### Phase 1: Trip Creation
```
1. User registers/logs in
   POST /api/auth/register or /api/auth/login
   → Receives JWT token
   → Stores token in localStorage

2. User creates trip
   POST /api/trips
   → Creates Trip record
   → Automatically adds creator as admin in TripMember
   → Returns trip with creator as first member

Database State:
- trips: { id, name, description, currency, budget, dates }
- trip_members: { id, tripId, userId, role: "admin" }
```

### Phase 2: Inviting Members
```
3. Admin invites members
   POST /api/trips/:id/members
   → Validates email exists in users table
   → Creates TripMember record with role: "member"
   → Sends notification to invited user

4. Invited user logs in
   GET /api/trips
   → Sees trip in their dashboard
   → Can access trip details

Database State:
- trip_members: Multiple records linking users to trip
- notifications: Invitation notifications
```

### Phase 3: Adding Expenses
```
5. Member adds expense
   POST /api/trips/:tripId/expenses
   → Creates Expense record
   → Creates ExpenseSplit records for each member
   → Calculates split amounts (equal or custom)
   → Notifies all trip members

Database State:
- expenses: { id, tripId, paidById, amount, description, category }
- expense_splits: { id, expenseId, userId, amount }
- notifications: Expense added notifications
```

### Phase 4: Viewing Balances
```
6. Member views balances
   GET /api/trips/:id/balances
   → Fetches all expenses for trip
   → Calculates for each member:
     * Total paid (sum of expenses they paid)
     * Total owed (sum of their splits)
     * Net balance (paid - owed)
   → Returns array of all member balances

7. Member views own balance
   GET /api/trips/:id/my-balance
   → Filters expenses for current user
   → Returns personalized balance summary
```

### Phase 5: Settlement Suggestions
```
8. Member views suggested payments
   GET /api/trips/:id/suggested-payments
   → Gets all balances
   → Separates creditors (positive) and debtors (negative)
   → Uses greedy algorithm to minimize transactions
   → Returns optimal payment plan

Algorithm:
- Sort creditors by amount (descending)
- Sort debtors by amount (ascending)
- Match largest creditor with largest debtor
- Continue until all balanced
```

### Phase 6: Trip Management
```
9. Admin updates trip
   PUT /api/trips/:id
   → Validates user is admin
   → Updates trip details
   → Returns updated trip

10. Admin removes member
    DELETE /api/trips/:id/members
    → Validates user is admin
    → Removes TripMember record
    → Cannot remove other admins

11. Admin deletes trip
    DELETE /api/trips/:id
    → Validates user is admin
    → Cascades delete:
      * All TripMember records
      * All Expense records
      * All ExpenseSplit records
      * All Settlement records
      * All related Notifications
```

---

## 🔒 Access Control Matrix

| Endpoint | Admin | Member | Non-Member |
|----------|-------|--------|------------|
| Create Trip | ✅ | ✅ | ✅ |
| View Trip | ✅ | ✅ | ❌ |
| Update Trip | ✅ | ❌ | ❌ |
| Delete Trip | ✅ | ❌ | ❌ |
| Invite Member | ✅ | ❌ | ❌ |
| Remove Member | ✅ | ❌ | ❌ |
| Add Expense | ✅ | ✅ | ❌ |
| View Expenses | ✅ | ✅ | ❌ |
| Update Expense | ✅ (own) | ✅ (own) | ❌ |
| Delete Expense | ✅ (own) | ✅ (own) | ❌ |
| View Balances | ✅ | ✅ | ❌ |
| View Own Balance | ✅ | ✅ | ❌ |

---

## 🗄️ Database Relationships

```
User (1) ──< (M) TripMember (M) >── (1) Trip
                                          │
                                          │
                                          ├──< (M) Expense
                                          │         │
                                          │         └──< (M) ExpenseSplit
                                          │
                                          └──< (M) Settlement

User (1) ──< (M) Expense (as paidBy)
User (1) ──< (M) Settlement (as payer)
User (1) ──< (M) Settlement (as receiver)
User (1) ──< (M) Notification
```

---

## 🧮 Balance Calculation Logic

```javascript
For each member in trip:
  1. Calculate totalPaid:
     Sum of all expenses where paidById = member.userId
  
  2. Calculate totalOwed:
     Sum of all expense_splits where userId = member.userId
  
  3. Calculate netBalance:
     netBalance = totalPaid - totalOwed
     
     If netBalance > 0: Member is OWED money
     If netBalance < 0: Member OWES money
     If netBalance = 0: Member is SETTLED

Example:
Trip with 3 members: A, B, C

Expense 1: A pays 3000 BDT, split equally
- A: paid=3000, owed=1000, net=+2000
- B: paid=0, owed=1000, net=-1000
- C: paid=0, owed=1000, net=-1000

Expense 2: B pays 1500 BDT, split equally
- A: paid=3000, owed=1500, net=+1500
- B: paid=1500, owed=1500, net=0
- C: paid=0, owed=1500, net=-1500

Settlement: C pays A 1500 BDT → All balanced
```

---

## ✅ API Testing Checklist

- [ ] Register new user
- [ ] Login user
- [ ] Create trip
- [ ] Get user's trips
- [ ] Get trip by ID
- [ ] Update trip
- [ ] Invite member
- [ ] Remove member
- [ ] Add expense (equal split)
- [ ] Add expense (custom split)
- [ ] Get trip expenses
- [ ] Update expense
- [ ] Delete expense
- [ ] Get all balances
- [ ] Get user balance
- [ ] Get suggested payments
- [ ] Get notifications
- [ ] Mark notification as read
- [ ] Delete trip

---

## 🚀 Quick Test Commands (using curl)

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 3. Create Trip (replace TOKEN)
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test Trip","currency":"BDT","budget":10000}'

# 4. Get Trips
curl -X GET http://localhost:5000/api/trips \
  -H "Authorization: Bearer TOKEN"
```
