# PosturePal (FITGRAM)

AI-powered posture tracking and fitness monitoring web application built with React, TypeScript, and Vite.

## Features

✨ **Real-time Posture Tracking** - Monitor your posture using AI-powered camera analysis  
📊 **Session Analytics** - Track your posture sessions with detailed statistics  
📈 **Dashboard** - View your progress and history over time  
⚙️ **Customizable Settings** - Adjust reminder intervals, sensitivity, and preferences  
💾 **Persistent Storage** - All data saved locally using IndexedDB  
🔔 **Smart Notifications** - Get reminded about posture issues  
👤 **User Profiles** - Create personalized profiles with fitness goals

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **IndexedDB** - Client-side database (via `idb` library)
- **Lucide React** - Icon library
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd posture-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run type-check       # Run TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

## Project Structure

```
posture-app/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx
│   │   ├── InfoScreen.tsx
│   │   ├── LandingScreen.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── PostureStatus.tsx
│   │   ├── ProfileSetupScreen.tsx
│   │   ├── SessionHistory.tsx
│   │   ├── SessionStats.tsx
│   │   ├── Settings.tsx
│   │   └── VideoFeed.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useCamera.ts
│   │   ├── useDatabase.ts
│   │   └── usePostureTracking.ts
│   ├── services/           # Service layer
│   │   └── database.ts     # IndexedDB operations
│   ├── types/              # TypeScript types
│   │   └── posture.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Build output
└── package.json
```

## Database & Persistence

PosturePal uses **IndexedDB** for client-side data persistence. All user data is stored locally in the browser.

### What's Stored?

- **User Profile** - Name, age, fitness goals, physical stats
- **Session History** - All posture tracking sessions with analytics
- **Settings** - User preferences and configurations

### Documentation

- 📖 [Database Quick Start](./DATABASE_QUICKSTART.md) - Get started quickly
- 📚 [Complete Database Documentation](./DATABASE.md) - Detailed technical docs

### Managing Data

Navigate to the **Settings** tab and use the **Data Management** section to:
- View current data
- Clear all stored data
- Reset the application

## Usage

1. **First Launch**
   - Go through the welcome screens
   - Set up your profile (or skip)
   - Start using the app

2. **Start Tracking**
   - Click "Start Camera" (if camera tracking is enabled)
   - Click "Start Tracking" to begin monitoring
   - The app will track your posture in real-time

3. **View Progress**
   - **Monitor Tab** - See live posture status
   - **Dashboard Tab** - View overall statistics
   - **History Tab** - Review past sessions
   - **Settings Tab** - Customize preferences

4. **Data Persistence**
   - All data is saved automatically
   - Data persists across browser sessions
   - Works offline (no internet required)

## Browser Support

- Chrome 24+ ✅
- Firefox 16+ ✅
- Safari 10+ ✅
- Edge 12+ ✅

## Privacy & Data

🔒 **Your data is 100% private**
- All data stored locally in your browser
- No data sent to external servers
- No tracking or analytics
- You control your data

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add types to `src/types/posture.ts`
3. Create hooks in `src/hooks/` if needed
4. Update `App.tsx` to integrate new features

### Database Operations

Use the provided hooks:

```typescript
import { useUserProfile, useSessionHistory, useSettings } from '@/hooks/useDatabase'

// In your component
const { profile, saveProfile } = useUserProfile()
const { sessions, addSession } = useSessionHistory()
const { settings, updateSettings } = useSettings(defaultSettings)
```

See [DATABASE.md](./DATABASE.md) for detailed API documentation.

## Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist/` directory.

## License

MIT License - see LICENSE file for details

## Author

**Dhruv Ghugal**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

### Camera not working?
- Check browser permissions
- Make sure you're using HTTPS (or localhost)
- Try a different browser

### Data not saving?
- Check if IndexedDB is enabled in your browser
- Not in private/incognito mode?
- See [DATABASE_QUICKSTART.md](./DATABASE_QUICKSTART.md) for more help

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Roadmap

- [ ] Export session data (CSV/JSON)
- [ ] Exercise recommendations based on posture issues
- [ ] Multi-user profiles
- [ ] Dark mode
- [ ] Mobile app version
- [ ] Advanced analytics and insights

---

Made with ❤️ by Dhruv Ghugal
