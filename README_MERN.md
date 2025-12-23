# PosturePal - MERN Stack Refactored

## 🎯 Project Overview

PosturePal is a consolidated MERN stack application for AI-powered posture tracking and fitness monitoring. This refactored version consolidates fragmented components into a clean, maintainable structure.

## 📁 New Streamlined Structure

```
posture-pal-mern/
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SharedUI.jsx    # Navbar, Footer, Buttons, Tabs
│   │   │   └── PostureMonitor.jsx  # All posture UI + webcam
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Landing + Info + Profile screens
│   │   │   ├── Dashboard.jsx   # Stats & History combined
│   │   │   └── Settings.jsx    # Settings page
│   │   ├── utils/
│   │   │   └── postureEngine.js  # All posture detection logic
│   │   ├── services/
│   │   │   └── api.js          # API calls to backend
│   │   ├── App.jsx             # Main app component
│   │   ├── index.js            # Entry point
│   │   └── styles.css          # Global styles
│   └── package.json
│
├── server/                      # Node/Express Backend
│   ├── models/
│   │   ├── User.js             # User authentication model
│   │   └── PostureSession.js   # Posture session logs
│   ├── routes/
│   │   └── api.js              # All API routes
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── server.js               # Main Express server
│   └── package.json
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
└── README_MERN.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <your-repo>
cd posture-app
```

### 2. Environment Variables

Create `.env` file in root:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB URI and JWT secret.

### 3. Backend Setup

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Frontend Setup (if using React client)

```bash
cd client
npm install
npm start
```

Client runs on `http://localhost:3000`

## 🔧 Key Consolidations

### 1. Frontend Consolidation

**Before:**
- Multiple fragmented component files
- Scattered UI logic
- Duplicate code across components

**After:**
- `SharedUI.jsx`: All reusable UI components (Navbar, Footer, Buttons, Tabs)
- `PostureMonitor.jsx`: All posture monitoring UI and webcam logic in one place
- `Landing.jsx`, `Dashboard.jsx`, `Settings.jsx`: Feature-based pages

### 2. Logic Consolidation

**Before:**
- Posture logic spread across multiple hooks
- Camera logic separate
- Session tracking fragmented

**After:**
- `postureEngine.js`: Single source of truth for:
  - WebcamManager
  - PostureAnalyzer
  - SessionTracker
  - StatsCalculator

### 3. Backend Consolidation

**Before:**
- No backend (IndexedDB only)

**After:**
- `server/server.js`: Unified Express server
- `server/routes/api.js`: All API endpoints in one file
- `server/models/`: Clean Mongoose models
- JWT authentication built-in

### 4. API Layer

**Before:**
- Direct IndexedDB calls from components

**After:**
- `services/api.js`: Centralized API communication
- Easy to swap between mock/real backend

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Profile
```
PUT    /api/profile          - Update user profile
```

### Settings
```
GET    /api/settings         - Get user settings
PUT    /api/settings         - Update settings
```

### Sessions
```
POST   /api/sessions         - Create session
GET    /api/sessions         - Get all sessions
GET    /api/sessions/:id     - Get single session
DELETE /api/sessions/:id     - Delete session
GET    /api/stats            - Get user statistics
DELETE /api/data             - Delete all data
```

## 🧪 Testing

### Test Backend

```bash
# Check server health
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Frontend

```bash
cd client
npm test
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Server verifies token via middleware

## 📊 Database Models

### User Model
- name, email, password (hashed)
- age, gender, height, weight
- fitnessGoal
- settings (reminderInterval, sensitivity, etc.)
- timestamps

### PostureSession Model
- userId (reference to User)
- startTime, endTime, totalTime
- goodPostureTime, averageScore
- issues array (type, severity, message)
- scores array (time-series data)
- deviceInfo

## 🎨 Frontend Architecture

### Components
- **SharedUI.jsx**: Reusable components (Navbar, Footer, Button, Tab, etc.)
- **PostureMonitor.jsx**: Video feed + posture status + session stats
- **Landing.jsx**: Welcome, info, profile setup screens
- **Dashboard.jsx**: Statistics overview + session history
- **Settings.jsx**: User preferences

### Utils
- **postureEngine.js**: Core posture detection logic
  - WebcamManager: Camera access
  - PostureAnalyzer: Posture analysis (mock or real ML)
  - SessionTracker: Session management
  - StatsCalculator: Statistics calculation

### Services
- **api.js**: HTTP requests to backend
  - authAPI, profileAPI, settingsAPI, sessionsAPI

## 🔄 Migration from Old Structure

### If you want to migrate your existing data:

1. Export IndexedDB data (use browser DevTools)
2. Transform to MongoDB format
3. Import using MongoDB tools or seed script

### Seed Script (optional)

Create `server/scripts/seed.js` for sample data.

## 🛠️ Development Workflow

### Adding New Features

1. **Backend**: Add route to `server/routes/api.js`
2. **Model**: Update or create model in `server/models/`
3. **Frontend API**: Add method to `client/src/services/api.js`
4. **UI**: Update component in `client/src/components/` or `pages/`
5. **Logic**: Add to `client/src/utils/postureEngine.js` if needed

### Code Organization Principles

- **Single Responsibility**: Each file has one clear purpose
- **DRY**: No duplicate code
- **Centralized Logic**: All math/detection in postureEngine.js
- **API Abstraction**: Backend calls only through api.js

## 📦 Deployment

### Backend (Heroku, Railway, Render)

```bash
cd server
npm start
```

Set environment variables in hosting platform.

### Frontend (Vercel, Netlify)

```bash
cd client
npm run build
```

Deploy `build/` folder.

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in `.env`

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- CORS configured
- Input validation (add express-validator if needed)
- Environment variables for secrets

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Or use MongoDB Atlas connection string
```

### CORS Errors
- Ensure `CLIENT_URL` in `.env` matches frontend URL
- Check CORS configuration in `server/server.js`

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

## 📝 TODO

- [ ] Add real MediaPipe/TensorFlow posture detection
- [ ] Add exercise recommendations
- [ ] Email notifications
- [ ] Data export (CSV/JSON)
- [ ] Dark mode
- [ ] Mobile responsive design
- [ ] PWA support

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file

## 👤 Author

**Dhruv Ghugal**

## 🙏 Acknowledgments

- Original PosturePal app structure
- MERN stack community
- MediaPipe/TensorFlow for posture detection concepts

---

**Made with ❤️ for better posture and health**
