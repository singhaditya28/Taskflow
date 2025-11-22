# TaskFlow - Role-Based Task Management System

A full-stack web application for managing tasks with role-based access control. Built with React (frontend) and FastAPI (backend), featuring JWT authentication, MongoDB database, and calendar integration.

## 🎯 Features

### Authentication & Authorization
- JWT-based authentication with secure password hashing (bcrypt)
- Role-based access control (Admin, Manager, User)
- Protected routes with automatic token refresh
- Persistent login sessions

### Role-Based Permissions

#### 👑 Admin
- Full access to all tasks
- Create, edit, delete, and assign tasks
- Manage user accounts (view, edit roles, delete users)
- Access to user management dashboard

#### 👔 Manager
- Create and assign tasks to team members
- View and update tasks they created
- View tasks assigned to them
- Cannot delete tasks or manage users

#### 👤 User
- View tasks assigned to them
- Update task status (To Do → In Progress → Completed)
- Cannot create, delete, or reassign tasks

### Task Management
- Create tasks with title, description, status, due date, and assignment
- Filter tasks by status
- Search tasks by title and description
- Update task status with one click
- Role-based task visibility

### Calendar View
- Interactive calendar powered by FullCalendar
- Month, week, and day views
- Tasks displayed on their due dates
- Color-coded by status (To Do, In Progress, Completed)
- Click on tasks to view details
- Role-based filtering (see only tasks you have access to)

### User Interface
- Modern, responsive design with TailwindCSS
- Intuitive navigation with role-based menu items
- Real-time form validation
- Loading states and error handling
- Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **PyMongo** - MongoDB driver
- **JWT (python-jose)** - Token-based authentication
- **Bcrypt (passlib)** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **FullCalendar** - Calendar component
- **date-fns** - Date utilities

## 📋 Prerequisites

Before running this application, make sure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **MongoDB** installed and running locally (or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Taskflow
```

### 2. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Make sure virtual environment is activated
uvicorn app.main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

## 👥 Sample Credentials

in SETUP.md file

## 📁 Project Structure

```
Interview-Goolluck/
├── backend/
│   ├── app/
│   │   ├── models/          # Pydantic models (User, Task)
│   │   ├── routes/          # API endpoints (auth, users, tasks)
│   │   ├── middleware/      # Authentication middleware
│   │   ├── utils/           # Security & permission helpers
│   │   ├── config.py        # Configuration settings
│   │   ├── database.py      # MongoDB connection
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API integration (axios, auth, tasks, users)
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── .env.example
│
├── TECHNOLOGY_GUIDE.md     # Detailed tech stack explanation
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/me` - Get current user
- `GET /api/users/{id}` - Get specific user
- `PUT /api/users/{id}` - Update user role
- `DELETE /api/users/{id}` - Delete user

### Tasks
- `GET /api/tasks` - List tasks (filtered by role)
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task (Admin only)

**Query Parameters for GET /api/tasks:**
- `status` - Filter by status (todo, in_progress, completed)
- `search` - Search in title and description
- `skip` - Pagination offset
- `limit` - Number of results (max 100)
- `start_date` - Filter tasks from this date (for calendar)
- `end_date` - Filter tasks until this date (for calendar)

## 🎨 Key Features Demonstration

### 1. Role-Based Access
- Login as different roles to see different permissions
- Admin can access User Management page
- Managers can create and assign tasks
- Users can only update status of their tasks

### 2. Task Management
- Create tasks with due dates
- Assign tasks to specific users (Admin/Manager only)
- Update task status with one click
- Search and filter tasks

### 3. Calendar Integration
- Switch between month, week, and day views
- Tasks appear on their due dates
- Color-coded by status
- Click tasks to view details

## 🔒 Security Features

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with expiration (24 hours)
- HTTP-only token storage
- Role-based route protection
- Input validation on both frontend and backend
- CORS configuration for secure cross-origin requests
- MongoDB injection prevention through Pydantic validation

## 🧪 Testing the Application

### Test Admin Features
1. Login as Admin
2. Navigate to "Users" page
3. View all users, edit roles, delete users
4. Create tasks and assign to anyone
5. Delete any task

### Test Manager Features
1. Login as Manager
2. Create a new task
3. Assign it to a user
4. Try to access Users page (should be denied)
5. Edit tasks you created

### Test User Features
1. Login as User
2. View tasks assigned to you
3. Update task status by clicking the badge
4. Try to create a task (limited access)
5. Try to access Users page (should be denied)

### Test Calendar
1. Create tasks with different due dates
2. Navigate to Calendar view
3. Switch between month/week/day views
4. Click on tasks to view details
5. Verify role-based filtering

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check MongoDB URL in backend `.env` file
- For MongoDB Atlas, use connection string with credentials

### CORS Errors
- Verify frontend URL is in `CORS_ORIGINS` in backend `.env`
- Default is `http://localhost:5173` for Vite dev server

### Port Already in Use
- Backend: Change port in uvicorn command: `--port 8001`
- Frontend: Vite will automatically suggest another port

### Dependencies Installation Issues
- Backend: Make sure you're in virtual environment
- Frontend: Try `npm install --legacy-peer-deps`
- Clear npm cache: `npm cache clean --force`

## 📝 Environment Variables

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

## 🚢 Deployment Considerations

### Backend
- Use environment variables for all secrets
- Set up proper MongoDB instance (MongoDB Atlas recommended)
- Use production ASGI server (Gunicorn + Uvicorn workers)
- Enable HTTPS
- Set secure CORS origins

### Frontend
- Build for production: `npm run build`
- Serve static files with nginx or similar
- Update `VITE_API_URL` to production backend URL
- Enable HTTPS



---

**Happy Task Managing! 🎉**
