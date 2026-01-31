@echo off
echo ===================================================
echo   Starting Living Security Perimeter...
echo ===================================================
echo.
echo URL: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server.
echo.

cd backend
uvicorn main:app --reload --port 8000

pause
