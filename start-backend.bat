@echo off
echo ========================================
echo TaskFlow - Starting Backend Server
echo ========================================
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing/updating dependencies...
pip install -q -r requirements.txt

echo.
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

set PYTHONPATH=%CD%
uvicorn app.main:app --reload --port 8000
