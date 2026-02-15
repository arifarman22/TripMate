# TripMate - Quick Start

## Setup Instructions

### 1. Install Dependencies
```bash
# From root directory (F:\TripMate)
npm run install:all
```

Or manually:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tripmate"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### 3. Setup Database
```bash
# From root directory
npm run db:setup
```

Or manually:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

## Test Login
- Email: alice@example.com
- Password: password123

## Useful Commands

### Backend
```bash
cd backend
npm run dev              # Start dev server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
```

### Frontend
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
```

## Troubleshooting

### "Cannot find package.json"
Make sure you're in the correct directory:
- Backend commands: `cd backend`
- Frontend commands: `cd frontend`

### Database connection error
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Create database: `createdb tripmate`

### Port already in use
- Backend (5000): Change PORT in backend/.env
- Frontend (3000): Change port in frontend/vite.config.js
