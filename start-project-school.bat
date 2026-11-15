@echo off
setlocal
cd /d "%~dp0"
if not exist "server\.env" (echo ERROR: Run setup-school.bat first.& pause& exit /b 1)
if not exist "server\node_modules" (echo ERROR: Run setup-school.bat first.& pause& exit /b 1)
if not exist "client\node_modules" (echo ERROR: Run setup-school.bat first.& pause& exit /b 1)
echo Make sure D:\mysql-portable\start.bat is already running.
start "Community API 5000" cmd /k "cd /d ""%~dp0server"" && npm start"
start "Community React 5173" cmd /k "cd /d ""%~dp0client"" && npm run dev"
echo Open http://localhost:5173 after both terminals are ready.
pause
