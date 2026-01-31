@echo off
echo ===================================================
echo   Living Security Perimeter - Installer
echo ===================================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies. Check if Python is installed.
    pause
    exit /b %errorlevel%
)
cd ..
echo [OK] Backend dependencies installed.
echo.

echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node dependencies. Check if Node.js is installed.
    pause
    exit /b %errorlevel%
)
echo [OK] Frontend dependencies installed.
echo.

echo [3/3] Building Frontend Application...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b %errorlevel%
)
cd ..
echo [OK] Frontend built successfully.
echo.

echo ===================================================
echo   Setup Complete!
echo   You can now run 'run_app.bat' to start the system.
echo ===================================================
pause
