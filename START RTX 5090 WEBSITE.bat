@echo off
title NVIDIA GEFORCE RTX 5090 Launch Experience
cd /d "%~dp0"

echo ===================================================
echo   NVIDIA GEFORCE RTX 5090 CINEMATIC LAUNCH WEBSITE
echo ===================================================
echo.
echo Starting local web server on port 8000...
echo.

:: Open default browser to the local website URL after a short 1 second delay
start "" cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:8000"

echo ===================================================
echo   RTX 5090 WEBSITE RUNNING
echo   http://localhost:8000
echo ===================================================
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

:: Start server with py launcher or python fallback
py -m http.server 8000 2>nul || python -m http.server 8000 2>nul || npx -y http-server -p 8000
pause
