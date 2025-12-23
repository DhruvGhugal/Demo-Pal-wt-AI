import { useState, useEffect, useCallback } from 'react'
import type { UserProfile, PostureSession, PostureSettings } from '@/types/posture'
import {
  initDB,
  getUserProfile,
  saveUserProfile as saveUserProfileDB,
  getAllSessions,
  saveSession as saveSessionDB,
  getSettings,
  saveSettings as saveSettingsDB,
  clearAllData,
} from '@/services/database'

export function useDatabase() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize database on mount
  useEffect(() => {
    initDB()
      .then(() => {
        setIsReady(true)
        setError(null)
      })
      .catch((err) => {
        console.error('Failed to initialize database:', err)
        setError('Failed to initialize database')
        setIsReady(false)
      })
  }, [])

  return { isReady, error }
}

// Hook for user profile
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setProfile(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load user profile:', err)
        setIsLoading(false)
      })
  }, [])

  const saveProfile = useCallback(async (newProfile: UserProfile) => {
    try {
      await saveUserProfileDB(newProfile)
      setProfile(newProfile)
    } catch (err) {
      console.error('Failed to save user profile:', err)
      throw err
    }
  }, [])

  return { profile, saveProfile, isLoading }
}

// Hook for session history
export function useSessionHistory() {
  const [sessions, setSessions] = useState<PostureSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessions = useCallback(async () => {
    try {
      const data = await getAllSessions()
      setSessions(data)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load sessions:', err)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const addSession = useCallback(async (session: PostureSession) => {
    try {
      await saveSessionDB(session)
      setSessions((prev) => [session, ...prev])
    } catch (err) {
      console.error('Failed to save session:', err)
      throw err
    }
  }, [])

  return { sessions, addSession, reloadSessions: loadSessions, isLoading }
}

// Hook for settings
export function useSettings(defaultSettings: PostureSettings) {
  const [settings, setSettings] = useState<PostureSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data) {
          setSettings(data)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load settings:', err)
        setIsLoading(false)
      })
  }, [])

  const updateSettings = useCallback(async (newSettings: PostureSettings) => {
    try {
      await saveSettingsDB(newSettings)
      setSettings(newSettings)
    } catch (err) {
      console.error('Failed to save settings:', err)
      throw err
    }
  }, [])

  return { settings, updateSettings, isLoading }
}

// Hook to clear all data
export function useClearData() {
  const [isClearing, setIsClearing] = useState(false)

  const clearData = useCallback(async () => {
    setIsClearing(true)
    try {
      await clearAllData()
    } catch (err) {
      console.error('Failed to clear data:', err)
      throw err
    } finally {
      setIsClearing(false)
    }
  }, [])

  return { clearData, isClearing }
}
