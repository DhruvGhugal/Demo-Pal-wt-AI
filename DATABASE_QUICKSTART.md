# Database Quick Start Guide

## What's New? 🎉

Your PosturePal app now has **persistent storage**! All your data is saved automatically and will be available even after closing the browser.

## What Gets Saved?

✅ **User Profile** - Name, age, fitness goals, etc.  
✅ **Session History** - All your posture tracking sessions  
✅ **Settings** - Your preferences and configurations

## How It Works

### Automatic Persistence

Everything happens automatically! When you:
- Create your profile → Saved to database
- Complete a session → Saved to database
- Change settings → Saved to database

No manual save buttons required (except for settings changes).

### Data Storage Location

All data is stored **locally** in your browser using IndexedDB:
- 🔒 **Private**: Data never leaves your computer
- 💾 **Persistent**: Survives browser restarts
- 🚀 **Fast**: No network requests needed

## Quick Test

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Create a profile**:
   - Go through the onboarding
   - Enter your details
   - Click "Complete Setup"

3. **Close and reopen the browser**:
   - Your profile should still be there!
   - All your data is preserved

4. **Track a session**:
   - Start a posture tracking session
   - Stop it after a minute
   - Refresh the page
   - Check the History tab - your session is saved!

## Managing Your Data

### View Stored Data

Open browser DevTools:
- **Chrome**: F12 → Application → IndexedDB → posture-pal-db
- **Firefox**: F12 → Storage → IndexedDB → posture-pal-db
- **Edge**: F12 → Application → IndexedDB → posture-pal-db

### Clear All Data

In the app:
1. Go to **Settings** tab
2. Scroll to **Data Management** section
3. Click **Clear All Data**
4. Confirm the action
5. App will reload with fresh state

### Manual Database Reset (Dev)

In browser console:
```javascript
indexedDB.deleteDatabase('posture-pal-db')
```
Then refresh the page.

## Files Added

```
src/
├── services/
│   └── database.ts          # Core database operations
├── hooks/
│   └── useDatabase.ts       # React hooks for database
```

## Files Modified

```
src/
├── App.tsx                  # Integrated database hooks
└── components/
    └── Settings.tsx         # Added data management UI
```

## API Examples

### Save User Profile
```typescript
const { saveProfile } = useUserProfile()

await saveProfile({
  name: 'John',
  age: 25,
  gender: 'male',
  height: 175,
  weight: 70,
  fitnessGoal: 'posture_correction',
  createdAt: new Date()
})
```

### Add Session
```typescript
const { addSession } = useSessionHistory()

await addSession({
  id: 'session-123',
  startTime: new Date(),
  endTime: new Date(),
  totalTime: 3600,
  goodPostureTime: 3000,
  averageScore: 85,
  issues: []
})
```

### Update Settings
```typescript
const { updateSettings } = useSettings(defaultSettings)

await updateSettings({
  reminderInterval: 20,
  sensitivitiy: 0.8,
  enableReminders: true,
  enableCamera: true
})
```

## Troubleshooting

### Data Not Persisting?

1. **Check browser compatibility**: IndexedDB works in all modern browsers
2. **Private/Incognito mode**: Data won't persist in private browsing
3. **Storage quota**: Check if browser storage is full
4. **Console errors**: Look for errors in browser DevTools

### Browser Storage Full?

Clear other site data or increase browser storage limits in settings.

### Want to Start Fresh?

Use the "Clear All Data" button in Settings or delete the database manually.

## Learn More

See `DATABASE.md` for complete documentation including:
- Detailed schema information
- All available API methods
- Advanced usage patterns
- Migration strategies

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify IndexedDB is enabled in browser
3. Try clearing data and starting fresh
4. Check `DATABASE.md` for detailed documentation
