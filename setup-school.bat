@echo off
setlocal
cd /d "%~dp0"
echo [1/4] Node.js version check
where node >nul 2>nul
if errorlevel 1 (echo ERROR: Node.js is not installed or not in PATH.& pause& exit /b 1)
where npm >nul 2>nul
if errorlevel 1 (echo ERROR: npm is not installed.& pause& exit /b 1)
if not exist "server\.env" copy "server\.env.example" "server\.env" >nul
if not exist "client\.env" copy "client\.env.example" "client\.env" >nul
echo [2/4] Installing server packages...
cd /d "%~dp0server"
call npm install
if errorlevel 1 (echo ERROR: server npm install failed.& pause& exit /b 1)
echo [3/4] Installing client packages...
cd /d "%~dp0client"
call npm install
if errorlevel 1 (echo ERROR: client npm install failed.& pause& exit /b 1)
echo [4/4] Finished. Run init-db-school.bat once, then start-project-school.bat.
pause
