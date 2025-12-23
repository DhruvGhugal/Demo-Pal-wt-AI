import { useState, useEffect } from 'react'
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export type NotificationType = 'success' | 'warning' | 'error' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  persistent?: boolean
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.persistent && notification.duration !== 0) {
        const duration = notification.duration || 5000
        const timer = setTimeout(() => {
          onDismiss(notification.id)
        }, duration)
        
        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onDismiss])

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} />
      case 'warning': return <AlertTriangle size={18} />
      case 'error': return <AlertTriangle size={18} />
      case 'info': return <Info size={18} />
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
          </div>
          <button 
            className="notification-close"
            onClick={() => onDismiss(notification.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Predefined notification types
  const showSuccess = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration })
  }

  const showWarning = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration })
  }

  const showError = (title: string, message: string, persistent?: boolean) => {
    return addNotification({ type: 'error', title, message, persistent })
  }

  const showInfo = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showWarning,
    showError,
    showInfo,
  }
}
