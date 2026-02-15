@echo off
echo ========================================
echo TripMate - Complete Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing backend dependencies
    exit /b 1
)
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies
    exit /b 1
)
echo.

echo [3/4] Setting up Backend Environment...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please update with your database credentials
    echo.
    pause
)
echo.

echo [4/4] Generating Prisma Client...
call npx prisma generate
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update backend\.env with your database credentials
echo 2. Run: cd backend ^&^& npm run prisma:migrate
echo 3. Run: cd backend ^&^& npm run prisma:seed
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
pause
