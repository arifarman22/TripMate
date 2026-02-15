# TripMate Deployment Guide

## 🚀 Deployment Steps

### 1. Database Setup (Choose One)

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy PostgreSQL connection string
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Deploy PostgreSQL service
3. Copy DATABASE_URL

### 2. Vercel Deployment

#### Backend + Frontend (Monorepo)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel --prod
```

#### Environment Variables in Vercel
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

**Backend Variables:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = `your-postgres-connection-string`
- `JWT_SECRET` = `your-256-bit-secret`
- `JWT_REFRESH_SECRET` = `your-256-bit-refresh-secret`
- `CORS_ORIGIN` = `https://your-domain.vercel.app`

**Frontend Variables:**
- `VITE_API_URL` = `https://your-backend-domain.vercel.app/api`

### 3. Database Migration
```bash
# After deployment, run migrations
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 4. CI/CD Setup

#### GitHub Secrets
Add these to GitHub → Settings → Secrets:
- `VERCEL_TOKEN` - From Vercel → Settings → Tokens
- `VERCEL_ORG_ID` - From vercel.json after first deploy
- `VERCEL_PROJECT_ID` - From vercel.json after first deploy

## 📋 Production Checklist

### Security
- [ ] Strong JWT secrets (256-bit minimum)
- [ ] Database credentials secured
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] Environment variables set

### Performance
- [ ] Frontend build optimized
- [ ] Database indexes created
- [ ] Static assets cached
- [ ] API response compression

### Monitoring
- [ ] Error logging configured
- [ ] Database connection monitoring
- [ ] API endpoint health checks
- [ ] Performance metrics tracking

### Database
- [ ] Production database created
- [ ] Migrations applied
- [ ] Seed data loaded (if needed)
- [ ] Backup strategy implemented

### Testing
- [ ] Frontend builds successfully
- [ ] Backend API endpoints working
- [ ] Authentication flow tested
- [ ] Database operations verified

## 🔧 Quick Commands

```bash
# Local development
npm run setup
npm run dev:backend
npm run dev:frontend

# Production preparation
npm run deploy:prep

# Database operations
cd backend
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio

# Deployment
vercel --prod
```

## 🌐 Alternative Deployment Options

### Frontend Only (Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

### Backend Only (Railway/Fly.io)
```bash
cd backend
# Follow platform-specific deployment guides
```

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **CORS Errors**: Verify CORS_ORIGIN matches frontend domain
3. **Build Failures**: Ensure all dependencies installed
4. **Migration Errors**: Run `prisma migrate deploy` manually

### Environment Variables
- Use `.env.production.template` files as reference
- Never commit actual `.env` files
- Verify all required variables are set in deployment platform