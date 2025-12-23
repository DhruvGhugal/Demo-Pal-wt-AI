import { Clock, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import type { PostureSession } from '@/types/posture'

interface SessionHistoryProps {
  sessions: PostureSession[]
  onSelectSession?: (session: PostureSession) => void
}

export function SessionHistory({ sessions, onSelectSession }: SessionHistoryProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (sessionDate.getTime() === today.getTime()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (sessionDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'var(--ok)'
    if (score >= 70) return '#eab308'
    return 'var(--danger)'
  }

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  if (sessions.length === 0) {
    return (
      <div className="panel">
        <h3>Session History</h3>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
          <Calendar size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <p>No sessions recorded yet.</p>
          <p>Start tracking to build your history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <h3>Session History</h3>
      
      <div className="session-list">
        {sortedSessions.map((session) => (
          <div 
            key={session.id} 
            className={`session-item ${onSelectSession ? 'clickable' : ''}`}
            onClick={() => onSelectSession?.(session)}
          >
            <div className="session-header">
              <div className="session-date">
                <Calendar size={16} />
                {formatDate(session.startTime)}
              </div>
              <div 
                className="session-score" 
                style={{ color: getScoreColor(session.averageScore) }}
              >
                {Math.round(session.averageScore)}%
              </div>
            </div>
            
            <div className="session-details">
              <div className="session-stat">
                <Clock size={14} />
                <span>{formatTime(session.totalTime)}</span>
              </div>
              
              <div className="session-stat">
                <TrendingUp size={14} />
                <span>{formatTime(session.goodPostureTime)} good</span>
              </div>
              
              {session.issues.length > 0 && (
                <div className="session-stat">
                  <AlertTriangle size={14} />
                  <span>{session.issues.length} issues</span>
                </div>
              )}
            </div>
            
            {session.endTime && (
              <div className="session-duration">
                Duration: {formatTime(Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="session-summary">
        <div className="summary-stat">
          <span className="summary-label">Total Sessions</span>
          <span className="summary-value">{sessions.length}</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Average Score</span>
          <span className="summary-value">
            {Math.round(sessions.reduce((acc, s) => acc + s.averageScore, 0) / sessions.length)}%
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Time</span>
          <span className="summary-value">
            {formatTime(sessions.reduce((acc, s) => acc + s.totalTime, 0))}
          </span>
        </div>
      </div>
    </div>
  )
}
