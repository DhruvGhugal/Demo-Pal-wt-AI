# How to View User Data

There are **two ways** to view the data stored by users in PosturePal:

## Method 1: In the App (Easiest) ⭐

### Steps:
1. **Run the app**: `npm run dev`
2. **Navigate to Settings tab** (top navigation)
3. **Scroll down** to find "Stored Data Viewer" section
4. **Expand sections** to view:
   - 👤 **User Profile** - Name, age, fitness goals, etc.
   - 🕐 **Sessions** - All tracking sessions with full details
   - ⚙️ **Settings** - Current app preferences

### Features:
- ✅ Collapsible sections for easy navigation
- ✅ Formatted data (dates, durations, percentages)
- ✅ Session count and full history
- ✅ No technical knowledge required

### Screenshot Location:
```
App → Settings Tab → Scroll Down → "Stored Data Viewer"
```

---

## Method 2: Browser DevTools (For Developers) 🔧

### Chrome / Edge

1. **Open the app** in Chrome or Edge
2. Press **F12** (or **Ctrl+Shift+I**)
3. Click the **Application** tab
4. In the left sidebar:
   - Expand **Storage** section
   - Expand **IndexedDB**
   - Click **posture-pal-db**
5. You'll see three object stores:
   - `userProfile` - User profile data
   - `sessions` - Session history
   - `settings` - App settings
6. Click each store to view the data

### Firefox

1. **Open the app** in Firefox
2. Press **F12**
3. Click the **Storage** tab
4. In the left sidebar:
   - Expand **IndexedDB**
   - Click **posture-pal-db**
5. Browse the three stores

### Safari

1. **Open the app** in Safari
2. Press **Cmd+Option+I**
3. Click the **Storage** tab
4. Navigate to **IndexedDB** → **posture-pal-db**

---

## What Data Is Stored?

### 1. User Profile (`userProfile` store)
```json
{
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "fitnessGoal": "posture_correction",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Sessions (`sessions` store)
```json
{
  "id": "session-123",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T11:00:00.000Z",
  "totalTime": 3600,
  "goodPostureTime": 3000,
  "averageScore": 85,
  "issues": []
}
```

### 3. Settings (`settings` store)
```json
{
  "reminderInterval": 15,
  "sensitivitiy": 0.7,
  "enableReminders": true,
  "enableCamera": true
}
```

---

## Data Statistics

You can see aggregated statistics in the app:

### Dashboard Tab
- Total Sessions
- Average Score
- Total Time Tracked
- Weekly Goals

### History Tab
- List of all sessions
- Individual session details
- Chronological order

---

## Exporting Data (Manual)

If you need to export data from DevTools:

1. Open DevTools (Method 2 above)
2. Navigate to the data store
3. Right-click on a record
4. Select **Copy** or **Export**
5. Paste into a text editor

### Programmatic Export (Future Feature)

Export functionality is planned for a future update. See the roadmap in `README.md`.

---

## Privacy & Security 🔒

- All data is stored **locally** in your browser
- Data **never leaves** your computer
- No cloud storage or external servers
- Only you can access this data
- Data persists until you clear it or delete browser data

---

## Common Questions

### Q: Where exactly is the data stored?
**A:** In your browser's IndexedDB storage, managed by the browser itself.

### Q: Can I access data from another browser?
**A:** No, data is browser-specific. Chrome data won't appear in Firefox.

### Q: What happens in private/incognito mode?
**A:** Data is temporarily stored but deleted when you close the private window.

### Q: How much data can be stored?
**A:** Modern browsers allow several GB. Your posture data will use very little (< 10MB typically).

### Q: How do I delete my data?
**A:** Go to Settings → Data Management → Clear All Data

### Q: Can I backup my data?
**A:** Currently manual export via DevTools. Automatic export/import is planned for future releases.

---

## Troubleshooting

### Data not showing in app?
1. Refresh the page
2. Check browser console for errors (F12 → Console)
3. Verify IndexedDB is enabled in browser settings

### Can't see IndexedDB in DevTools?
1. Make sure you've run the app at least once
2. Try refreshing DevTools
3. Check if you're in the right origin (localhost:5173)

### Data disappeared?
1. Check if you're in private/incognito mode
2. Verify you didn't clear browser data
3. Make sure you're using the same browser

---

## For Developers

### Accessing Data Programmatically

```typescript
import { getUserProfile, getAllSessions, getSettings } from '@/services/database'

// Get user profile
const profile = await getUserProfile()
console.log('Profile:', profile)

// Get all sessions
const sessions = await getAllSessions()
console.log('Sessions:', sessions)

// Get settings
const settings = await getSettings()
console.log('Settings:', settings)
```

### Database Structure

See `DATABASE.md` for complete technical documentation.

---

## Need Help?

- 📖 See `DATABASE_QUICKSTART.md` for quick start guide
- 📚 See `DATABASE.md` for detailed documentation  
- 🐛 Check browser console for errors
- 💬 Open an issue on GitHub (if applicable)
