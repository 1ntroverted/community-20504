@echo off
setlocal
cd /d "%~dp0"
set "MYSQL=D:\mysql-portable\bin\mysql.exe"
if not exist "%MYSQL%" (echo ERROR: MySQL not found at %MYSQL%& pause& exit /b 1)
echo MySQL server must already be running. Run D:\mysql-portable\start.bat first.
echo This script creates community_20504 tables if missing.
"%MYSQL%" -h 127.0.0.1 -P 3306 -u root --default-character-set=utf8mb4 < "%~dp0database\schema.sql"
if errorlevel 1 (echo ERROR: SQL import failed. Check MySQL server and root password.& pause& exit /b 1)
echo Database initialized successfully.
pause
