@echo off
echo ========================================
echo Starting TripMate Application
echo ========================================
echo.

echo Checking if .env exists...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Update .env with your PostgreSQL credentials!
    echo Press any key after updating .env file...
    pause
)

echo.
echo [1/3] Generating Prisma Client...
call npx prisma generate

echo.
echo [2/3] Running Database Migrations...
call npx prisma migrate dev --name init

echo.
echo [3/3] Seeding Database...
call npm run prisma:seed

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo Backend will run on http://localhost:5000
echo Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
