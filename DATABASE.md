# PosturePal Database Implementation

## Overview

PosturePal now uses **IndexedDB** for client-side data persistence. All user data (profiles, sessions, and settings) is stored locally in the browser and persists across page refreshes.

## Technology Stack

- **IndexedDB**: Browser-based NoSQL database
- **idb**: Promise-based wrapper library for easier IndexedDB usage

## Database Schema

### Stores

#### 1. `userProfile`
Stores user profile information.

**Key**: `'current'` (single user profile)

**Value Type**: `UserProfile`
```typescript
{
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  weight: number // in kg
  fitnessGoal: 'strength' | 'flexibility' | 'posture_correction' | 'endurance'
  createdAt: Date
}
```

#### 2. `sessions`
Stores posture tracking session history.

**Key**: `id` (string, session ID)

**Value Type**: `PostureSession`
```typescript
{
  id: string
  startTime: Date
  endTime?: Date
  totalTime: number // in seconds
  goodPostureTime: number // in seconds
  averageScore: number
  issues: PostureIssue[]
}
```

**Indexes**:
- `by-start-time`: Indexed by `startTime` for efficient chronological queries

#### 3. `settings`
Stores user preferences and app settings.

**Key**: `'current'` (single settings object)

**Value Type**: `PostureSettings`
```typescript
{
  reminderInterval: number // in minutes
  sensitivitiy: number // 0.1 to 1.0
  enableReminders: boolean
  enableCamera: boolean
}
```

## API Reference

### Database Service (`src/services/database.ts`)

#### Initialization
```typescript
initDB(): Promise<IDBPDatabase<PostureDB>>
```
Initializes the database. Called automatically by hooks.

#### User Profile
```typescript
saveUserProfile(profile: UserProfile): Promise<void>
getUserProfile(): Promise<UserProfile | null>
deleteUserProfile(): Promise<void>
```

#### Sessions
```typescript
saveSession(session: PostureSession): Promise<void>
getAllSessions(): Promise<PostureSession[]>
getSessionById(id: string): Promise<PostureSession | null>
deleteSession(id: string): Promise<void>
clearAllSessions(): Promise<void>
```

#### Settings
```typescript
saveSettings(settings: PostureSettings): Promise<void>
getSettings(): Promise<PostureSettings | null>
deleteSettings(): Promise<void>
```

#### Utility
```typescript
clearAllData(): Promise<void>
```
Clears all data from the database (profile, sessions, and settings).

## React Hooks (`src/hooks/useDatabase.ts`)

### `useDatabase()`
Initializes the database and returns status.

```typescript
const { isReady, error } = useDatabase()
```

### `useUserProfile()`
Manages user profile with automatic persistence.

```typescript
const { profile, saveProfile, isLoading } = useUserProfile()
```

### `useSessionHistory()`
Manages session history with automatic persistence.

```typescript
const { sessions, addSession, reloadSessions, isLoading } = useSessionHistory()
```

### `useSettings(defaultSettings)`
Manages app settings with automatic persistence.

```typescript
const { settings, updateSettings, isLoading } = useSettings({
  reminderInterval: 15,
  sensitivitiy: 0.7,
  enableReminders: true,
  enableCamera: true,
})
```

### `useClearData()`
Provides function to clear all stored data.

```typescript
const { clearData, isClearing } = useClearData()
```

## Usage Example

```typescript
import { useUserProfile, useSessionHistory, useSettings } from '@/hooks/useDatabase'

function App() {
  const { profile, saveProfile } = useUserProfile()
  const { sessions, addSession } = useSessionHistory()
  const { settings, updateSettings } = useSettings(defaultSettings)

  // Save profile
  const handleProfileSubmit = async (newProfile: UserProfile) => {
    await saveProfile(newProfile)
  }

  // Add session
  const handleSessionComplete = async (session: PostureSession) => {
    await addSession(session)
  }

  // Update settings
  const handleSettingsChange = async (newSettings: PostureSettings) => {
    await updateSettings(newSettings)
  }

  return (
    // Your component JSX
  )
}
```

## Data Management

Users can manage their data through the Settings page:

1. **View Settings**: Navigate to Settings tab
2. **Clear All Data**: Click "Clear All Data" button in the Data Management section
3. **Confirmation**: Confirm the action (irreversible)
4. **Auto-reload**: App automatically reloads after clearing data

## Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+

## Storage Limits

- **Chrome/Edge**: Up to 60% of free disk space
- **Firefox**: Up to 50% of free disk space
- **Safari**: Up to 1GB

Users will be prompted if storage quota is exceeded.

## Data Privacy

- All data is stored **locally** in the user's browser
- No data is transmitted to external servers
- Data persists across sessions but can be cleared anytime
- Standard browser privacy modes (incognito) will not persist data

## Development

### Testing the Database

Open browser DevTools:
1. **Chrome/Edge**: Application tab → IndexedDB → posture-pal-db
2. **Firefox**: Storage tab → IndexedDB → posture-pal-db
3. **Safari**: Storage tab → IndexedDB → posture-pal-db

### Clearing Database (Dev)

```javascript
// In browser console
indexedDB.deleteDatabase('posture-pal-db')
```

Or use the "Clear All Data" button in the app's Settings.

## Migration

Current version: **1**

Future schema changes will be handled through database version upgrades in the `initDB()` function.
