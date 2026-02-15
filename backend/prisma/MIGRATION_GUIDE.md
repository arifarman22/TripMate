# Database Migration Strategy

## Initial Setup

### 1. Install Dependencies
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Configure Database
Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tripmate?schema=public"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Create Initial Migration
```bash
npx prisma migrate dev --name init
```

## Migration Commands

### Development
```bash
# Create and apply migration
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate deploy
```

### Production
```bash
# Apply migrations without prompts
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

## Seed Database
```bash
npx prisma db seed
```

## Common Migrations

### Add New Field
1. Update `schema.prisma`
2. Run: `npx prisma migrate dev --name add_field_name`

### Add Index
1. Add `@@index([field])` to model
2. Run: `npx prisma migrate dev --name add_index_name`

### Modify Field Type
1. Update field in `schema.prisma`
2. Run: `npx prisma migrate dev --name modify_field_type`

## Rollback Strategy

Prisma doesn't support automatic rollbacks. To rollback:

1. **Manual Rollback:**
```bash
# Revert to specific migration
npx prisma migrate resolve --rolled-back <migration_name>
```

2. **Database Restore:**
- Use PostgreSQL backup/restore
- Keep regular backups in production

## Best Practices

1. **Always backup production before migrations**
2. **Test migrations in staging first**
3. **Use descriptive migration names**
4. **Review generated SQL before applying**
5. **Never edit migration files manually**
6. **Keep migrations small and focused**

## Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Opens at http://localhost:5555
