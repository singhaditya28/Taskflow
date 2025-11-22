# Quick Start Guide

## First Time Setup

### 1. Install MongoDB
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
copy .env.example .env
```

### 3. Setup Frontend
```bash
cd frontend
npm install
copy .env.example .env
```

## Running the Application

### Option 1: Using Scripts (Preferred) (Windows)
Double-click these files:
- `start-backend.bat` - Starts backend server
- `start-frontend.bat` - Starts frontend server

### Option 2: Manual
**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Create Sample Users

After starting the backend, run:
```bash
cd backend
python create_sample_users.py
```

This creates:
- admin@goolluck.com / Admin@123
- manager@goolluck.com / Manager@123
- user@goolluck.com / User@123

## Access the Application

1. Open browser: http://localhost:5173
2. Sign up or login with sample credentials
3. Explore different roles and features!

## Common Issues

**MongoDB not running:**
```bash
# Start MongoDB service
net start MongoDB
```

**Port already in use:**
- Backend: Change port in start-backend.bat
- Frontend: Vite will suggest alternative port

**Dependencies error:**
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
npm cache clean --force
npm install
```
