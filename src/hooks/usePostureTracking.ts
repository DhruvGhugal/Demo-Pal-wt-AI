import { useState, useEffect, useCallback } from 'react'
import type { PostureStatus, PostureSession } from '@/types/posture'

export function usePostureTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<PostureStatus | null>(null)
  const [session, setSession] = useState<PostureSession | null>(null)

  const startTracking = useCallback(() => {
    setIsTracking(true)
    const newSession: PostureSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      totalTime: 0,
      goodPostureTime: 0,
      averageScore: 0,
      issues: [],
    }
    setSession(newSession)
  }, [])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
    setCurrentStatus(null)
    if (session) {
      setSession(prev => prev ? { ...prev, endTime: new Date() } : null)
    }
  }, [session])

  // Mock posture analysis - replace with actual ML model
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      // Mock analysis - randomly generate posture status
      const mockStatus: PostureStatus = {
        isGood: Math.random() > 0.3,
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: new Date(),
        issues: Math.random() > 0.5 ? [{
          type: ['forward_head', 'rounded_shoulders', 'slouching'][Math.floor(Math.random() * 3)] as any,
          severity: ['mild', 'moderate'][Math.floor(Math.random() * 2)] as any,
          message: 'Consider adjusting your posture'
        }] : [],
      }
      
      setCurrentStatus(mockStatus)
      
      // Update session stats
      setSession(prev => {
        if (!prev) return null
        const now = new Date()
        const totalTime = Math.floor((now.getTime() - prev.startTime.getTime()) / 1000)
        const goodPostureTime = prev.goodPostureTime + (mockStatus.isGood ? 2 : 0)
        
        return {
          ...prev,
          totalTime,
          goodPostureTime,
          averageScore: totalTime > 0 ? (goodPostureTime / totalTime) * 100 : 0,
          issues: mockStatus.issues.length > 0 ? [...prev.issues, ...mockStatus.issues] : prev.issues,
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isTracking])

  return {
    isTracking,
    currentStatus,
    session,
    startTracking,
    stopTracking,
  }
}
