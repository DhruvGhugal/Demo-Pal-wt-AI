import { useState } from 'react'
import { Settings as SettingsIcon, Save, RotateCcw, Trash2 } from 'lucide-react'
import type { PostureSettings } from '@/types/posture'
import { useClearData } from '@/hooks/useDatabase'
import { DataViewer } from './DataViewer'

interface SettingsProps {
  settings: PostureSettings
  onSettingsChange: (settings: PostureSettings) => void
}

export function Settings({ settings, onSettingsChange }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<PostureSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { clearData, isClearing } = useClearData()

  const handleChange = (field: keyof PostureSettings, value: any) => {
    const newSettings = { ...localSettings, [field]: value }
    setLocalSettings(newSettings)
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(settings))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  const handleClearAllData = async () => {
    try {
      await clearData()
      setShowClearConfirm(false)
      window.location.reload() // Reload to reset app state
    } catch (err) {
      console.error('Failed to clear data:', err)
      alert('Failed to clear data. Please try again.')
    }
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <SettingsIcon size={20} />
        <h3>Posture Settings</h3>
      </div>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Reminder Interval */}
        <div className="setting-group">
          <label htmlFor="reminderInterval" className="setting-label">
            Reminder Interval (minutes)
          </label>
          <input
            id="reminderInterval"
            type="range"
            min="1"
            max="60"
            value={localSettings.reminderInterval}
            onChange={(e) => handleChange('reminderInterval', parseInt(e.target.value))}
            className="slider"
          />
          <span className="setting-value">{localSettings.reminderInterval}min</span>
        </div>

        {/* Sensitivity */}
        <div className="setting-group">
          <label htmlFor="sensitivity" className="setting-label">
            Detection Sensitivity
          </label>
          <input
            id="sensitivity"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={localSettings.sensitivitiy}
            onChange={(e) => handleChange('sensitivitiy', parseFloat(e.target.value))}
            className="slider"
          />
          <span className="setting-value">{Math.round(localSettings.sensitivitiy * 100)}%</span>
        </div>

        {/* Enable Reminders */}
        <div className="setting-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={localSettings.enableReminders}
              onChange={(e) => handleChange('enableReminders', e.target.checked)}
            />
            <span className="checkmark"></span>
            Enable posture reminders
          </label>
        </div>

        {/* Enable Camera */}
        <div className="setting-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={localSettings.enableCamera}
              onChange={(e) => handleChange('enableCamera', e.target.checked)}
            />
            <span className="checkmark"></span>
            Enable camera monitoring
          </label>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="setting-actions">
            <button onClick={handleReset} className="secondary">
              <RotateCcw size={16} />
              Reset
            </button>
            <button onClick={handleSave} className="primary">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* View Stored Data */}
      <div style={{ marginTop: '40px' }}>
        <DataViewer />
      </div>

      {/* Database Management */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <h3 style={{ marginBottom: '15px', color: '#d32f2f' }}>Data Management</h3>
        <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
          Clear all stored data including profile, sessions, and settings. This action cannot be undone.
        </p>
        
        {!showClearConfirm ? (
          <button 
            onClick={() => setShowClearConfirm(true)} 
            className="secondary"
            style={{ backgroundColor: '#ffebee', color: '#d32f2f', border: '1px solid #d32f2f' }}
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
              Are you sure?
            </span>
            <button 
              onClick={handleClearAllData}
              disabled={isClearing}
              style={{ backgroundColor: '#d32f2f', color: 'white' }}
            >
              {isClearing ? 'Clearing...' : 'Yes, Clear All'}
            </button>
            <button 
              onClick={() => setShowClearConfirm(false)}
              className="secondary"
              disabled={isClearing}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
