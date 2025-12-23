import { useState, useEffect } from 'react'
import { Database, User, Clock, Settings as SettingsIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { getUserProfile, getAllSessions, getSettings } from '@/services/database'
import type { UserProfile, PostureSession, PostureSettings } from '@/types/posture'

export function DataViewer() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sessions, setSessions] = useState<PostureSession[]>([])
  const [settings, setSettings] = useState<PostureSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    sessions: false,
    settings: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [profileData, sessionsData, settingsData] = await Promise.all([
        getUserProfile(),
        getAllSessions(),
        getSettings(),
      ])
      setProfile(profileData)
      setSessions(sessionsData)
      setSettings(settingsData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  if (isLoading) {
    return (
      <div className="panel">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Database size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <p>Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Database size={20} />
        <h3>Stored Data Viewer</h3>
      </div>

      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        View all data stored in your browser's IndexedDB database.
      </p>

      {/* User Profile Section */}
      <div style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('profile')}
          style={{
            width: '100%',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f5f5f5',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} />
            <span>User Profile</span>
            {!profile && <span style={{ fontSize: '12px', color: '#999' }}>(No data)</span>}
          </div>
          {expandedSections.profile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.profile && (
          <div style={{ padding: '15px' }}>
            {profile ? (
              <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Name:</strong>
                  <span>{profile.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Age:</strong>
                  <span>{profile.age}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Gender:</strong>
                  <span>{profile.gender}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Height:</strong>
                  <span>{profile.height} cm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Weight:</strong>
                  <span>{profile.weight} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Fitness Goal:</strong>
                  <span>{profile.fitnessGoal.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Created At:</strong>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>No profile data stored</p>
            )}
          </div>
        )}
      </div>

      {/* Sessions Section */}
      <div style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('sessions')}
          style={{
            width: '100%',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f5f5f5',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} />
            <span>Sessions ({sessions.length})</span>
          </div>
          {expandedSections.sessions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.sessions && (
          <div style={{ padding: '15px', maxHeight: '400px', overflowY: 'auto' }}>
            {sessions.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    style={{
                      padding: '12px',
                      background: '#f9f9f9',
                      borderRadius: '6px',
                      borderLeft: '3px solid #6366f1',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                      Session #{index + 1}
                    </div>
                    <div style={{ display: 'grid', gap: '5px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>ID:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{session.id}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Start Time:</span>
                        <span>{formatDate(session.startTime)}</span>
                      </div>
                      {session.endTime && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>End Time:</span>
                          <span>{formatDate(session.endTime)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Time:</span>
                        <span>{formatDuration(session.totalTime)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Good Posture Time:</span>
                        <span>{formatDuration(session.goodPostureTime)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Average Score:</span>
                        <span>{Math.round(session.averageScore)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Issues:</span>
                        <span>{session.issues.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>No sessions stored</p>
            )}
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('settings')}
          style={{
            width: '100%',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f5f5f5',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={18} />
            <span>Settings</span>
            {!settings && <span style={{ fontSize: '12px', color: '#999' }}>(No data)</span>}
          </div>
          {expandedSections.settings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.settings && (
          <div style={{ padding: '15px' }}>
            {settings ? (
              <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Reminder Interval:</strong>
                  <span>{settings.reminderInterval} minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Sensitivity:</strong>
                  <span>{Math.round(settings.sensitivitiy * 100)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Enable Reminders:</strong>
                  <span>{settings.enableReminders ? '✅ Yes' : '❌ No'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Enable Camera:</strong>
                  <span>{settings.enableCamera ? '✅ Yes' : '❌ No'}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>No settings stored</p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ fontSize: '13px', margin: 0, color: '#1565c0' }}>
          💡 <strong>Tip:</strong> You can also view this data in your browser's DevTools → Application → IndexedDB → posture-pal-db
        </p>
      </div>
    </div>
  )
}
