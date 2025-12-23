# 🚀 PosturePal MERN - Quick Start Guide

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas): [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**: [Download](https://git-scm.com/)

## 🎯 30-Second Setup

### Step 1: Clone & Navigate
```bash
cd C:\Users\Dhruv Ghugal\Projects\posture-app
```

### Step 2: Setup Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection
# MONGO_URI=mongodb://localhost:27017/posturepal
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/posturepal
```

### Step 3: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 4: Start Backend Server
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

### Step 5: Test Backend (Optional)
Open new terminal:
```bash
curl http://localhost:5000/health
```

You should see: `{"status":"OK","message":"PosturePal API is running"}`

## 🔧 Detailed Setup

### Backend Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env if not exists
touch .env  # Linux/Mac
# Or manually create .env file on Windows

# Add to .env:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/posturepal
JWT_SECRET=your_super_secret_key_change_in_production

# Start development server
npm run dev
```

### Frontend Installation (when frontend is ready)

```bash
# Navigate to client directory  
cd client

# Install dependencies
npm install

# Start development server
npm start
```

## 📋 What's Installed?

### Backend Dependencies (`server/package.json`)
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon** (dev): Auto-reload on file changes

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: [Download MSI](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   # Or older versions:
   mongo
   ```

4. **Set .env**
   ```
   MONGO_URI=mongodb://localhost:27017/posturepal
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select region closest to you
   - Create cluster

3. **Setup Database User**
   - Database Access → Add New Database User
   - Username: `posturepal`
   - Password: `<generate strong password>`
   - User Privileges: Read and write to any database

4. **Whitelist IP Address**
   - Network Access → Add IP Address
   - Add Current IP Address or Allow Access from Anywhere (for dev)

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password

6. **Set .env**
   ```
   MONGO_URI=mongodb+srv://posturepal:<password>@cluster0.xxxxx.mongodb.net/posturepal?retryWrites=true&w=majority
   ```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","age":25,"gender":"male"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get user (with token from login response)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. **Import Collection** (or create manually)

2. **Register User**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "age": 30,
       "gender": "male",
       "height": 175,
       "weight": 70,
       "fitnessGoal": "posture_correction"
     }
     ```

3. **Login**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from response

4. **Create Session** (Protected Route)
   - Method: POST
   - URL: `http://localhost:5000/api/sessions`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body (JSON):
     ```json
     {
       "startTime": "2024-01-01T10:00:00Z",
       "endTime": "2024-01-01T10:30:00Z",
       "totalTime": 1800,
       "goodPostureTime": 1200,
       "averageScore": 75,
       "issues": [],
       "scores": [
         {"score": 80, "timestamp": "2024-01-01T10:00:00Z"},
         {"score": 70, "timestamp": "2024-01-01T10:15:00Z"}
       ]
     }
     ```

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac:
brew services list

# Linux:
sudo systemctl status mongod

# If not running, start it:
sudo systemctl start mongod
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### JWT Secret Warning

**Warning:** Using default JWT secret

**Solution:**
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env:
JWT_SECRET=<generated_secret>
```

### CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked`

**Solution:**
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Default is already set to `http://localhost:3000`

## 📚 Next Steps

1. ✅ Backend is running
2. ✅ Test API endpoints
3. ⏳ Create frontend components (See `REFACTORING_SUMMARY.md`)
4. ⏳ Connect frontend to backend
5. ⏳ Add MediaPipe/TensorFlow for real posture detection
6. ⏳ Deploy to production

## 📖 Documentation

- **API Documentation**: See `README_MERN.md`
- **Refactoring Details**: See `REFACTORING_SUMMARY.md`
- **Original Project**: See `README.md`

## 💬 Need Help?

- Check `REFACTORING_SUMMARY.md` for detailed info
- Review code comments in source files
- Check MongoDB logs: `/var/log/mongodb/mongod.log`
- Check server logs in terminal

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB installed/Atlas configured
- [ ] `.env` file created
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB running
- [ ] Server starts without errors
- [ ] Health check responds
- [ ] Can register/login user
- [ ] Can create session

---

**🎉 Ready to code? Start building your frontend!**

```bash
# Backend is running at:
http://localhost:5000

# Check health:
http://localhost:5000/health

# API base:
http://localhost:5000/api
```
