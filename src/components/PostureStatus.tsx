import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { PostureStatus as PostureStatusType } from '@/types/posture'

interface PostureStatusProps {
  status: PostureStatusType | null
}

export function PostureStatus({ status }: PostureStatusProps) {
  if (!status) {
    return (
      <div className="panel">
        <h3>Posture Status</h3>
        <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
          Start tracking to see your posture status
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    if (status.isGood && status.issues.length === 0) {
      return <CheckCircle size={24} className="status ok" />
    } else if (status.issues.some(issue => issue.severity === 'severe')) {
      return <XCircle size={24} className="status bad" />
    } else {
      return <AlertTriangle size={24} className="status warn" />
    }
  }

  const getStatusText = () => {
    if (status.isGood && status.issues.length === 0) {
      return 'Good Posture'
    } else if (status.issues.some(issue => issue.severity === 'severe')) {
      return 'Poor Posture'
    } else {
      return 'Fair Posture'
    }
  }

  return (
    <div className="panel">
      <h3>Posture Status</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        {getStatusIcon()}
        <div>
          <div style={{ fontWeight: '600', fontSize: '18px' }}>
            {getStatusText()}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Confidence: {Math.round(status.confidence * 100)}%
          </div>
        </div>
      </div>

      {status.issues.length > 0 && (
        <div>
          <h4 style={{ margin: '12px 0 8px', fontSize: '14px', color: 'var(--muted)' }}>
            Issues Detected
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {status.issues.map((issue, index) => (
              <div key={index} className="badge">
                <AlertTriangle size={12} />
                {issue.message} ({issue.severity})
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
        Last updated: {status.timestamp.toLocaleTimeString()}
      </div>
    </div>
  )
}
