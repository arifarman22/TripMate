# Docker Deployment Guide

## Development Setup

### Start PostgreSQL Database
```bash
docker-compose up -d
```

This starts only the PostgreSQL database on port 5432.

### Update .env
```env
DATABASE_URL="postgresql://tripmate:tripmate_dev_password@localhost:5432/tripmate"
```

### Run Backend Locally
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Production Deployment

### 1. Create .env.production
```bash
cp .env.production.example .env.production
```

Edit `.env.production` with secure values:
- Strong DB_PASSWORD
- Strong JWT_SECRET and JWT_REFRESH_SECRET

### 2. Build and Start Services
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 3. Check Status
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app
```

### 4. Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

## Docker Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f db
```

### Execute Commands in Container
```bash
# Access app container
docker-compose -f docker-compose.prod.yml exec app sh

# Run Prisma commands
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec app npx prisma studio
```

### Database Backup
```bash
docker-compose -f docker-compose.prod.yml exec db pg_dump -U tripmate tripmate > backup.sql
```

### Database Restore
```bash
docker-compose -f docker-compose.prod.yml exec -T db psql -U tripmate tripmate < backup.sql
```

## Health Checks

### App Health
```bash
curl http://localhost:5000/health
```

### Database Health
```bash
docker-compose -f docker-compose.prod.yml exec db pg_isready -U tripmate
```

## Troubleshooting

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs app
```

### Database connection issues
```bash
# Check if database is ready
docker-compose -f docker-compose.prod.yml exec db pg_isready -U tripmate

# Check environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep DATABASE
```

### Reset everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```
