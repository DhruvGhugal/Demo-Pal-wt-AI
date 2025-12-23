import type { PostureSession } from '@/types/posture'

interface SessionStatsProps {
  session: PostureSession | null
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`
  } else if (mins > 0) {
    return `${mins}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function SessionStats({ session }: SessionStatsProps) {
  if (!session) {
    return (
      <div className="panel">
        <h3>Session Statistics</h3>
        <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
          No active session
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <h3>Session Statistics</h3>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div className="stat">
          <div>
            <div className="label">Total Time</div>
            <div className="value">{formatTime(session.totalTime)}</div>
          </div>
        </div>
        
        <div className="stat">
          <div>
            <div className="label">Good Posture Time</div>
            <div className="value">{formatTime(session.goodPostureTime)}</div>
          </div>
        </div>
        
        <div className="stat">
          <div>
            <div className="label">Posture Score</div>
            <div className="value">{Math.round(session.averageScore)}%</div>
          </div>
        </div>
        
        <div className="stat">
          <div>
            <div className="label">Issues Detected</div>
            <div className="value">{session.issues.length}</div>
          </div>
        </div>
      </div>

      {session.endTime && (
        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
          Session ended: {session.endTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
