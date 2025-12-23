import { useEffect, useRef } from 'react'
import type { CameraState } from '@/types/posture'

interface VideoFeedProps {
  camera: CameraState
  className?: string
}

export function VideoFeed({ camera, className = '' }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && camera.stream) {
      videoRef.current.srcObject = camera.stream
    }
  }, [camera.stream])

  if (camera.error) {
    return (
      <div className={`video ${className}`}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'var(--danger)',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h3>Camera Error</h3>
            <p>{camera.error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (camera.isLoading) {
    return (
      <div className={`video ${className}`}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%' 
        }}>
          Loading camera...
        </div>
      </div>
    )
  }

  if (!camera.isEnabled || !camera.stream) {
    return (
      <div className={`video ${className}`}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'var(--muted)'
        }}>
          Camera not active
        </div>
      </div>
    )
  }

  return (
    <div className={`video ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)', // Mirror the video
        }}
      />
    </div>
  )
}
