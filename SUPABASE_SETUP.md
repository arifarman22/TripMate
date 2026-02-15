# Supabase Integration Guide for TripMate

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: TripMate
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Connection Pooling (Recommended for Production)

For better performance, use the **Connection Pooling** string:
1. In Supabase Dashboard → **Settings** → **Database**
2. Find **Connection Pooling** section
3. Copy the **Transaction** mode connection string:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

## Step 3: Update Backend Environment Variables

Update your `backend/.env` file:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# For Production (with connection pooling)
# DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Other environment variables
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Step 4: Configure Prisma for Supabase

Your `prisma/schema.prisma` is already configured correctly. Supabase uses standard PostgreSQL.

If you need to add connection pooling support, update the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

Then in `.env`:
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 5: Run Database Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Push schema to Supabase (for first time)
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate deploy
```

## Step 6: Verify Connection

Test your connection:

```bash
# Start the backend server
npm run dev

# You should see: "Database connected successfully"
```

## Step 7: View Database in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. You should see all your tables:
   - users
   - trips
   - trip_members
   - expenses
   - expense_splits
   - settlements
   - notifications

## Supabase Features You Can Use

### 1. Database Backups
- Automatic daily backups (Pro plan)
- Manual backups available in Dashboard

### 2. SQL Editor
- Run custom queries in Dashboard → **SQL Editor**
- Useful for debugging and data inspection

### 3. Database Monitoring
- View real-time database metrics
- Monitor query performance
- Track connection usage

### 4. Row Level Security (Optional)
If you want to add RLS policies:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Create policies (example)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

## Production Deployment Checklist

- [ ] Use connection pooling URL for production
- [ ] Set `connection_limit=1` in DATABASE_URL for serverless
- [ ] Enable SSL mode: `?sslmode=require`
- [ ] Set up database backups
- [ ] Monitor connection usage
- [ ] Use environment variables (never commit credentials)

## Troubleshooting

### Connection Timeout
```env
DATABASE_URL="postgresql://...?connect_timeout=10"
```

### SSL Issues
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### Too Many Connections
Use connection pooling URL or add:
```env
DATABASE_URL="postgresql://...?connection_limit=1"
```

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without migrations
npx prisma db push --force-reset
```

## Environment Variables Summary

### Development (.env)
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
```

### Production (.env.production)
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## Next Steps

1. ✅ Create Supabase project
2. ✅ Copy connection string
3. ✅ Update .env file
4. ✅ Run migrations
5. ✅ Test connection
6. 🚀 Deploy your application!

## Support

- Supabase Docs: https://supabase.com/docs
- Prisma + Supabase: https://www.prisma.io/docs/guides/database/supabase
- TripMate Issues: Check your project repository