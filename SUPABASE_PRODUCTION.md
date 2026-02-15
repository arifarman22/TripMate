# Supabase Production Configuration

## Environment Variables for Production

```env
# Supabase Connection (with pooling)
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"

# Application
NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend
FRONTEND_URL=https://your-domain.com

# Rate Limiting
RATE_LIMIT_MAX=100
```

## Deployment Platforms

### Vercel
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway
1. Create new project from GitHub
2. Add Supabase DATABASE_URL
3. Deploy with one click

### Render
1. Create new Web Service
2. Connect repository
3. Add environment variables
4. Deploy

## Connection Pooling

For serverless deployments (Vercel, Netlify Functions):
- Use Transaction mode pooling
- Set `connection_limit=1`
- Use `pgbouncer=true` parameter

## Monitoring

Check Supabase Dashboard for:
- Active connections
- Query performance
- Database size
- Backup status

## Security Checklist

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable SSL mode in production
- [ ] Set up database backups
- [ ] Monitor connection usage
- [ ] Use environment variables (never commit secrets)
- [ ] Enable Row Level Security (optional)
- [ ] Set up API rate limiting
- [ ] Configure CORS properly