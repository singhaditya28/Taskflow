# Setup Instructions for TaskFlow

## Complete Setup Guide

### Step 1: Install Prerequisites

1. **Install Python 3.8+**
   - Download from https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Install Node.js 16+**
   - Download from https://nodejs.org/
   - This includes npm

3. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Install as a service
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux

# Edit .env file and update these values:
# MONGODB_URL=mongodb://localhost:27017  (or your MongoDB Atlas URL)
# SECRET_KEY=your-very-secret-key-here   (generate a random string)
# DATABASE_NAME=task_management
```

**Generate a secure SECRET_KEY:**
```python
# Run this in Python to generate a secure key:
import secrets
print(secrets.token_hex(32))
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux

# The default VITE_API_URL=http://localhost:8000 should work
```

### Step 4: Start MongoDB

**If using local MongoDB:**
```bash
# Windows (run as Administrator):
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

**If using MongoDB Atlas:**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update MONGODB_URL in backend/.env

### Step 5: Run the Application

**Option A: Using Scripts (Windows)**
1. Double-click `start-backend.bat`
2. Double-click `start-frontend.bat`

**Option B: Manual**

Terminal 1 - Backend:
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 6: Create Sample Users

After backend is running, in a new terminal:
```bash
cd backend
python create_sample_users.py
```

This creates three test accounts:
- **Admin:** admin@goolluck.com / Admin@123
- **Manager:** manager@goolluck.com / Manager@123
- **User:** user@goolluck.com / User@123

### Step 7: Access the Application

1. Open browser: http://localhost:5173
2. Login with one of the sample accounts
3. Explore the features!

## Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server started successfully (http://localhost:8000)
- [ ] Frontend server started successfully (http://localhost:5173)
- [ ] Sample users created
- [ ] Can login and see dashboard
- [ ] Can create tasks
- [ ] Calendar view works

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Make sure virtual environment is activated
- Check if port 8000 is available

### Frontend won't start
- Delete node_modules and run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Check if port 5173 is available

### Can't connect to MongoDB
- Verify MongoDB service is running
- Check MONGODB_URL in .env
- For Atlas, check network access and database user permissions

### CORS errors
- Verify frontend URL is in CORS_ORIGINS in backend/.env
- Default should include http://localhost:5173

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=task_management
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Next Steps

1. Test all three user roles (Admin, Manager, User)
2. Create tasks with different due dates
3. Test calendar functionality
4. Try user management (as Admin)
5. Test role-based permissions

## Need Help?

- Check README.md for detailed documentation
- See TECHNOLOGY_GUIDE.md for tech stack details
- Review API docs at http://localhost:8000/docs
