# Quick Start Script

## Start Backend
cd backend
npm run dev

## Start Frontend (in new terminal)
cd frontend
npm run dev

## Create Admin User (first time only)
cd backend
npm run seed

## Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin Login: http://localhost:5173/admin/login
  - Email: admin@roboticsclub.com
  - Password: admin123

## MongoDB
Make sure MongoDB is running:
- Windows: net start MongoDB
- Mac/Linux: sudo systemctl start mongod
- Or use MongoDB Atlas (cloud)
