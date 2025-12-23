# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**PosturePal (FITGRAM)** is an AI-powered posture tracking and fitness monitoring web application. It uses browser-based camera analysis to monitor user posture in real-time, providing feedback and maintaining session history.

**Tech Stack**: React 18, TypeScript, Vite, IndexedDB (via `idb`), Lucide React icons, Vitest

## Development Commands

### Running the App
```bash
npm run dev              # Start dev server (port 3000, auto-opens browser)
npm run build            # Build for production (runs type-check first)
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run type-check       # TypeScript type checking without emitting files
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted correctly
```

### Testing
```bash
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Generate test coverage report
```

## Code Architecture

### Data Flow & State Management

The app uses **React hooks** for state management with **IndexedDB** for persistence:

1. **App.tsx** is the root component managing:
   - Screen navigation (landing → info → profile → dashboard)
   - Tab navigation within main app (monitor, dashboard, history, settings)
   - Database initialization and coordination between hooks
   - URL-based routing with browser history API

2. **Database Layer** (3-tier architecture):
   - **services/database.ts**: Core IndexedDB operations, exports async functions
   - **hooks/useDatabase.ts**: React hooks wrapping database functions with loading states
   - **Components**: Use hooks to interact with persisted data

3. **Key Hooks**:
   - `useDatabase()`: Initializes IndexedDB, returns ready state
   - `useUserProfile()`: Manages user profile with auto-persistence
   - `useSessionHistory()`: Manages posture session history
   - `useSettings()`: Manages app settings with defaults
   - `useCamera()`: Handles webcam access
   - `usePostureTracking()`: Mock posture analysis (placeholder for ML model)

### IndexedDB Schema

Database name: `posture-pal-db` (version 1)

**Object Stores**:
- `userProfile` (key: 'current'): Single user profile
- `sessions` (keyPath: 'id', indexed by: 'startTime'): Posture tracking sessions
- `settings` (key: 'current'): App preferences

### Component Structure

Components follow a presentation/logic split:
- **Screen Components**: LandingScreen, InfoScreen, ProfileSetupScreen (onboarding flow)
- **Tab Components**: Dashboard, SessionHistory, Settings (main app views)
- **Feature Components**: VideoFeed, PostureStatus, SessionStats, NotificationSystem
- **Utility Components**: DataViewer (for viewing stored data in Settings)

### Type System

All types are centralized in `src/types/posture.ts`:
- Core types: `PostureStatus`, `PostureSession`, `PostureSettings`, `UserProfile`
- UI types: `AppScreen`, `CameraState`
- Future types: `Exercise`, `ExerciseSession` (not yet implemented)

### Path Aliases

TypeScript path mapping configured in `tsconfig.json` and `vite.config.ts`:
```typescript
import { Component } from '@/components/Component'
import { useHook } from '@/hooks/useHook'
import type { Type } from '@/types/posture'
```

## Important Patterns

### Posture Tracking Flow

1. User starts tracking → `usePostureTracking().startTracking()`
2. Hook creates new `PostureSession` with unique ID
3. Mock interval (2s) generates `PostureStatus` updates
4. Session stats accumulate (totalTime, goodPostureTime, averageScore)
5. User stops tracking → session gets `endTime`
6. App.tsx useEffect detects completed session → calls `addSession()`
7. Session persisted to IndexedDB and added to UI state

### Settings Persistence

Settings have default values in App.tsx. When user changes settings:
1. Component calls `handleSettingsChange()` 
2. Async `updateSettings()` from hook saves to IndexedDB
3. Local state updates immediately (optimistic UI)
4. Success/error notification shown to user

### Screen Navigation

App uses custom routing (not React Router):
- State: `currentScreen` (AppScreen type)
- URL sync: `window.history.pushState()` updates browser URL
- Back button: `popstate` event listener syncs state from URL
- Helper: `navigateToScreen()` function updates both state and URL

## Development Notes

### Mocking AI/ML

Current posture analysis is **mocked** in `usePostureTracking.ts`:
- Random posture status generated every 2 seconds
- Replace with actual ML model integration when ready
- Model should analyze video frames and return `PostureStatus`

### Camera Implementation

`useCamera.ts` requests `getUserMedia()` but actual video processing is placeholder.
Integration points for real posture detection:
1. Get video stream from `camera.stream`
2. Extract frames from `<video>` element in `VideoFeed.tsx`
3. Process frames through ML model
4. Update `PostureStatus` in tracking hook

### Testing Strategy

- Test setup: `src/test/setup.ts` (jsdom environment)
- Testing library: `@testing-library/react` + `@testing-library/jest-dom`
- Coverage tool: `c8`
- Run tests after changes to hooks or database operations

### Database Operations

Always use hooks for database operations in components:
```typescript
// ✅ Correct
const { profile, saveProfile } = useUserProfile()
await saveProfile(newProfile)

// ❌ Avoid direct imports in components
import { saveUserProfile } from '@/services/database'
```

Direct database service imports are acceptable in new hooks or utilities.

## Code Style

### TypeScript
- Strict mode enabled
- Unused locals/parameters not allowed (except `_` prefix)
- No implicit any
- Use explicit types for function parameters and returns

### Formatting (Prettier)
- No semicolons
- Single quotes
- Trailing commas (ES5)
- 2 space indentation
- 80 character line width

### ESLint
- Follow recommended TypeScript rules
- React Refresh enabled for HMR
- Unused vars with `_` prefix are allowed

## Windows Development

This project is developed on Windows (PowerShell). Commands should work in both PowerShell and bash, but note:
- File paths use Windows format in config (converted by tools)
- Line endings: CRLF (configured in git)
- Port 3000 is default (not 5173 as typical Vite)

## Key Files Reference

- **App.tsx**: Main orchestration, screen/tab routing, database coordination
- **services/database.ts**: IndexedDB operations (CRUD for all stores)
- **hooks/useDatabase.ts**: React hooks for database with loading states
- **hooks/usePostureTracking.ts**: Mock posture analysis (replace with real ML)
- **types/posture.ts**: All TypeScript type definitions
- **DATABASE.md**: Detailed database schema and API reference
- **DATABASE_QUICKSTART.md**: User-facing database guide
- **HOW_TO_VIEW_DATA.md**: Instructions for viewing stored data

## Data Privacy

All data is stored **locally** in the browser's IndexedDB:
- No external API calls or data transmission
- No cloud storage
- Users can clear data via Settings → Data Management
- Private browsing doesn't persist data

## Future Enhancements (Roadmap)

See README.md for planned features:
- Export session data (CSV/JSON)
- Exercise recommendations based on posture
- Multi-user profiles
- Dark mode
- Mobile app version
