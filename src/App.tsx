import { useState, useEffect } from 'react'
import { Activity, Camera, CameraOff, Play, Square, Monitor, BarChart3, Settings as SettingsIcon, History } from 'lucide-react'
import { useCamera } from '@/hooks/useCamera'
import { usePostureTracking } from '@/hooks/usePostureTracking'
import { useDatabase, useUserProfile, useSessionHistory, useSettings } from '@/hooks/useDatabase'
import { VideoFeed } from '@/components/VideoFeed'
import { PostureStatus } from '@/components/PostureStatus'
import { SessionStats } from '@/components/SessionStats'
import { Dashboard } from '@/components/Dashboard'
import { Settings } from '@/components/Settings'
import { SessionHistory } from '@/components/SessionHistory'
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem'
import { LandingScreen } from '@/components/LandingScreen'
import { InfoScreen } from '@/components/InfoScreen'
import { ProfileSetupScreen } from '@/components/ProfileSetupScreen'
import type { PostureSettings, UserProfile, AppScreen } from '@/types/posture'

type Tab = 'monitor' | 'dashboard' | 'history' | 'settings'

function App() {
  // Initialize database
  const db = useDatabase()
  
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    // Initialize from URL path
    const path = window.location.pathname
    switch (path) {
      case '/info': return 'info'
      case '/profile': return 'profile'
      case '/dashboard': return 'dashboard'
      default: return 'landing'
    }
  })
  
  const [activeTab, setActiveTab] = useState<Tab>('monitor')
  
  // Use database hooks for persistent storage
  const { profile: userProfile, saveProfile } = useUserProfile()
  const { sessions: sessionHistory, addSession } = useSessionHistory()
  const { settings, updateSettings } = useSettings({
    reminderInterval: 15,
    sensitivitiy: 0.7,
    enableReminders: true,
    enableCamera: true,
  })
  
  const camera = useCamera()
  const posture = usePostureTracking()
  const notifications = useNotifications()

  // Navigation helper that updates both state and URL
  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen)
    const path = screen === 'landing' ? '/' : `/${screen}`
    window.history.pushState({}, '', path)
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      switch (path) {
        case '/info':
          setCurrentScreen('info')
          break
        case '/profile':
          setCurrentScreen('profile')
          break
        case '/dashboard':
          setCurrentScreen('dashboard')
          break
        default:
          setCurrentScreen('landing')
          break
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Update page title based on current screen
  useEffect(() => {
    const titles = {
      landing: 'Welcome - PosturePal',
      info: 'About - PosturePal',
      profile: 'Setup Profile - PosturePal',
      dashboard: 'Dashboard - PosturePal',
      monitor: 'Monitor - PosturePal',
      history: 'History - PosturePal',
      summary: 'Summary - PosturePal',
      exercises: 'Exercises - PosturePal',
      monitoring: 'Monitoring - PosturePal'
    }
    document.title = titles[currentScreen] || 'PosturePal - AI Posture Tracking'
  }, [currentScreen])

  // Handle posture reminders
  useEffect(() => {
    if (!settings.enableReminders || !posture.isTracking || !posture.currentStatus) return

    if (!posture.currentStatus.isGood && posture.currentStatus.issues.length > 0) {
      const hasServerIssue = posture.currentStatus.issues.some(issue => issue.severity === 'severe')
      
      if (hasServerIssue) {
        notifications.showWarning(
          'Poor Posture Detected',
          'Consider adjusting your posture for better health.',
          8000
        )
      }
    }
  }, [posture.currentStatus, settings.enableReminders, posture.isTracking])

  // Save completed sessions to history and database
  useEffect(() => {
    if (posture.session && posture.session.endTime && !sessionHistory.find(s => s.id === posture.session!.id)) {
      addSession(posture.session)
        .then(() => {
          notifications.showSuccess(
            'Session Complete',
            `Great job! You tracked for ${Math.floor(posture.session!.totalTime / 60)} minutes with ${Math.round(posture.session!.averageScore)}% posture score.`
          )
        })
        .catch((err) => {
          console.error('Failed to save session:', err)
          notifications.showWarning(
            'Session Save Failed',
            'Your session could not be saved to the database.',
            5000
          )
        })
    }
  }, [posture.session, sessionHistory, addSession, notifications])

  const handleStartTracking = () => {
    if (settings.enableCamera && !camera.isEnabled) {
      camera.startCamera()
    }
    posture.startTracking()
    notifications.showInfo(
      'Tracking Started',
      'Your posture monitoring session has begun.'
    )
  }

  const handleStopTracking = () => {
    posture.stopTracking()
    if (camera.isEnabled) {
      camera.stopCamera()
    }
  }

  const handleSettingsChange = async (newSettings: PostureSettings) => {
    try {
      await updateSettings(newSettings)
      notifications.showSuccess(
        'Settings Saved',
        'Your preferences have been updated.'
      )
    } catch (err) {
      console.error('Failed to save settings:', err)
      notifications.showWarning(
        'Settings Save Failed',
        'Your settings could not be saved.',
        5000
      )
    }
  }

  // Screen navigation handlers
  const handleLandingStart = () => {
    navigateToScreen('info')
  }

  const handleInfoNext = () => {
    navigateToScreen('profile')
  }

  const handleInfoBack = () => {
    navigateToScreen('landing')
  }

  const handleInfoSkip = () => {
    navigateToScreen('dashboard')
    notifications.showInfo(
      'Welcome to PosturePal!',
      'You can set up your profile later in Settings.'
    )
  }

  const handleProfileComplete = async (profile: UserProfile) => {
    try {
      await saveProfile(profile)
      navigateToScreen('dashboard')
      notifications.showSuccess(
        'Welcome to PosturePal!',
        `Hi ${profile.name}, your profile has been created successfully!`
      )
    } catch (err) {
      console.error('Failed to save profile:', err)
      notifications.showWarning(
        'Profile Save Failed',
        'Your profile could not be saved. Please try again.',
        5000
      )
    }
  }

  const handleProfileBack = () => {
    navigateToScreen('info')
  }

  const handleProfileSkip = () => {
    navigateToScreen('dashboard')
    notifications.showInfo(
      'Setup Skipped',
      'You can complete your profile anytime in Settings.'
    )
  }

  const totalSessions = sessionHistory.length + (posture.session ? 1 : 0)
  const totalTime = sessionHistory.reduce((acc, s) => acc + s.totalTime, 0) + (posture.session?.totalTime || 0)
  const averageScore = totalSessions > 0 
    ? (sessionHistory.reduce((acc, s) => acc + s.averageScore, 0) + (posture.session?.averageScore || 0)) / totalSessions
    : 0

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitor':
        return (
          <div className="grid">
            <div>
              <VideoFeed camera={camera} />
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <PostureStatus status={posture.currentStatus} />
              <SessionStats session={posture.session} />
            </div>
          </div>
        )
      
      case 'dashboard':
        return (
          <Dashboard
            totalSessions={totalSessions}
            averageScore={averageScore}
            totalTime={totalTime}
            weeklyGoal={settings.reminderInterval * 4} // Simple weekly goal based on reminder interval
          />
        )
      
      case 'history':
        return (
          <SessionHistory sessions={sessionHistory} />
        )
      
      case 'settings':
        return (
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )
    }
  }

  // Render different screens based on current screen
  if (currentScreen === 'landing') {
    return (
      <>
        <LandingScreen onStart={handleLandingStart} />
        <NotificationSystem
          notifications={notifications.notifications}
          onDismiss={notifications.removeNotification}
        />
      </>
    )
  }

  if (currentScreen === 'info') {
    return (
      <>
        <InfoScreen 
          onNext={handleInfoNext}
          onBack={handleInfoBack}
          onSkip={handleInfoSkip}
        />
        <NotificationSystem
          notifications={notifications.notifications}
          onDismiss={notifications.removeNotification}
        />
      </>
    )
  }

  if (currentScreen === 'profile') {
    return (
      <>
        <ProfileSetupScreen 
          onComplete={handleProfileComplete}
          onBack={handleProfileBack}
          onSkip={handleProfileSkip}
        />
        <NotificationSystem
          notifications={notifications.notifications}
          onDismiss={notifications.removeNotification}
        />
      </>
    )
  }

  // Main app with tabs (dashboard, monitor, etc.)
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Activity size={24} />
          PosturePal
        </div>
        <div className="controls">
          {!posture.isTracking ? (
            <>
              {settings.enableCamera && (
                <button 
                  onClick={camera.isEnabled ? camera.stopCamera : camera.startCamera}
                  disabled={camera.isLoading}
                >
                  {camera.isEnabled ? <CameraOff size={16} /> : <Camera size={16} />}
                  {camera.isEnabled ? 'Stop Camera' : 'Start Camera'}
                </button>
              )}
              <button 
                className="primary"
                onClick={handleStartTracking}
                disabled={settings.enableCamera && camera.isLoading}
              >
                <Play size={16} />
                Start Tracking
              </button>
            </>
          ) : (
            <button onClick={handleStopTracking}>
              <Square size={16} />
              Stop Tracking
            </button>
          )}
        </div>
      </header>

      <main className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'monitor' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitor')}
          >
            <Monitor size={18} />
            Monitor
          </button>
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} />
            History
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={18} />
            Settings
          </button>
        </div>

        {renderTabContent()}
      </main>

      <footer className="footer">
        {userProfile ? `Welcome back, ${userProfile.name}!` : '© 2024 PosturePal - AI Posture Tracking'}
        {db.error && <span style={{ color: 'red', marginLeft: '1rem' }}>Database Error</span>}
      </footer>

      <NotificationSystem
        notifications={notifications.notifications}
        onDismiss={notifications.removeNotification}
      />
    </div>
  )
}

export default App
