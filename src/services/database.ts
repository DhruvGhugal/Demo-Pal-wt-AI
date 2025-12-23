import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { UserProfile, PostureSession, PostureSettings } from '@/types/posture'

// Define database schema
interface PostureDB extends DBSchema {
  userProfile: {
    key: string
    value: UserProfile
  }
  sessions: {
    key: string
    value: PostureSession
    indexes: { 'by-start-time': Date }
  }
  settings: {
    key: string
    value: PostureSettings
  }
}

const DB_NAME = 'posture-pal-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<PostureDB> | null = null

// Initialize database
export async function initDB(): Promise<IDBPDatabase<PostureDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<PostureDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create user profile store
      if (!db.objectStoreNames.contains('userProfile')) {
        db.createObjectStore('userProfile')
      }

      // Create sessions store with index
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
        sessionStore.createIndex('by-start-time', 'startTime')
      }

      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    },
  })

  return dbInstance
}

// User Profile operations
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const db = await initDB()
  await db.put('userProfile', profile, 'current')
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const db = await initDB()
  const profile = await db.get('userProfile', 'current')
  return profile || null
}

export async function deleteUserProfile(): Promise<void> {
  const db = await initDB()
  await db.delete('userProfile', 'current')
}

// Session operations
export async function saveSession(session: PostureSession): Promise<void> {
  const db = await initDB()
  await db.put('sessions', session)
}

export async function getAllSessions(): Promise<PostureSession[]> {
  const db = await initDB()
  const sessions = await db.getAllFromIndex('sessions', 'by-start-time')
  return sessions.reverse() // Most recent first
}

export async function getSessionById(id: string): Promise<PostureSession | null> {
  const db = await initDB()
  const session = await db.get('sessions', id)
  return session || null
}

export async function deleteSession(id: string): Promise<void> {
  const db = await initDB()
  await db.delete('sessions', id)
}

export async function clearAllSessions(): Promise<void> {
  const db = await initDB()
  await db.clear('sessions')
}

// Settings operations
export async function saveSettings(settings: PostureSettings): Promise<void> {
  const db = await initDB()
  await db.put('settings', settings, 'current')
}

export async function getSettings(): Promise<PostureSettings | null> {
  const db = await initDB()
  const settings = await db.get('settings', 'current')
  return settings || null
}

export async function deleteSettings(): Promise<void> {
  const db = await initDB()
  await db.delete('settings', 'current')
}

// Clear all data
export async function clearAllData(): Promise<void> {
  const db = await initDB()
  await Promise.all([
    db.clear('userProfile'),
    db.clear('sessions'),
    db.clear('settings'),
  ])
}
