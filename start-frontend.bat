@echo off
echo ========================================
echo TaskFlow - Starting Frontend Server
echo ========================================
echo.

python backend/create_sample_users.py 
echo.
cd frontend

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting Vite dev server...
echo Frontend will be available at: http://localhost:5173
echo.

npm run dev
