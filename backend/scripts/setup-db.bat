@echo off
echo Setting up TripMate Database...

if not exist .env (
    echo .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please update DATABASE_URL in .env file
    exit /b 1
)

echo Generating Prisma Client...
call npx prisma generate

echo Running database migrations...
call npx prisma migrate dev --name init

echo Seeding database with sample data...
call npm run prisma:seed

echo Database setup complete!
echo You can now start the server with: npm run dev
echo Access Prisma Studio with: npm run prisma:studio
