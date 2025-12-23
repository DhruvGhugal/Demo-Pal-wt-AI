import { useState, useEffect, useCallback } from 'react'
import type { CameraState } from '@/types/posture'

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    isEnabled: false,
    isLoading: false,
    error: null,
    stream: null,
  })

  const startCamera = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      setState(prev => ({
        ...prev,
        isEnabled: true,
        isLoading: false,
        stream,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isEnabled: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to access camera',
      }))
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop())
    }
    setState({
      isEnabled: false,
      isLoading: false,
      error: null,
      stream: null,
    })
  }, [state.stream])

  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [state.stream])

  return {
    ...state,
    startCamera,
    stopCamera,
  }
}
