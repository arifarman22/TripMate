@echo off
echo ========================================
echo TripMate - Starting Application
echo ========================================
echo.
echo This will open 2 terminal windows:
echo 1. Backend Server (Port 5000)
echo 2. Frontend Server (Port 3000)
echo.
pause

start "TripMate Backend" cmd /k "cd backend && run.bat"
timeout /t 3 /nobreak > nul
start "TripMate Frontend" cmd /k "cd frontend && run.bat"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window or press Ctrl+C to exit
pause
