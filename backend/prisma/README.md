# TripMate Database Setup

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tripmate?schema=public"
JWT_SECRET="your-secret-key-here"
```

### 3. Run Setup Script
**Windows:**
```bash
cd scripts
setup-db.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### 4. Manual Setup (Alternative)
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

## Database Commands

### Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Studio (GUI)
```bash
npm run prisma:studio
```
Opens at http://localhost:5555

### Seed Database
```bash
npm run prisma:seed
```

### Backup Database
```bash
cd scripts
backup-db.bat  # Windows
./backup-db.sh # Linux/Mac
```

## Sample Data

After seeding, you can login with:
- **Email:** alice@example.com
- **Password:** password123

Other test users:
- bob@example.com
- charlie@example.com

## Troubleshooting

### Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Migration Failed
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Prisma Client Not Found
```bash
npx prisma generate
```

## Documentation
- [Schema Documentation](./SCHEMA_DOCS.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
