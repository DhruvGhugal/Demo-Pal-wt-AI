import { useState } from 'react'
import { User, ArrowRight, ArrowLeft } from 'lucide-react'
import type { UserProfile } from '@/types/posture'

interface ProfileSetupScreenProps {
  onComplete: (profile: UserProfile) => void
  onBack: () => void
  onSkip: () => void
}

export function ProfileSetupScreen({ onComplete, onBack, onSkip }: ProfileSetupScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as UserProfile['gender'],
    height: '',
    weight: '',
    fitnessGoal: 'posture_correction' as UserProfile['fitnessGoal']
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const fitnessGoalOptions = [
    { value: 'posture_correction', label: 'Posture Correction', icon: '🧘‍♂️', description: 'Improve posture and reduce back pain' },
    { value: 'strength', label: 'Strength Building', icon: '💪', description: 'Build muscle and increase strength' },
    { value: 'flexibility', label: 'Flexibility', icon: '🤸‍♀️', description: 'Improve mobility and flexibility' },
    { value: 'endurance', label: 'Endurance', icon: '🏃‍♂️', description: 'Build stamina and cardiovascular health' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack() // Go back to info screen
    }
  }

  const handleSubmit = () => {
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      fitnessGoal: formData.fitnessGoal,
      createdAt: new Date()
    }
    onComplete(profile)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.age && formData.gender
      case 2:
        return formData.height && formData.weight
      case 3:
        return formData.fitnessGoal
      default:
        return false
    }
  }

  return (
    <div className="profile-setup-screen">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-icon">
            <User size={40} />
          </div>
          <h1 className="profile-title">Let's Set Up Your Profile</h1>
          <p className="profile-subtitle">
            Help us personalize your fitness journey
          </p>
          <button className="skip-setup-btn" onClick={onSkip}>
            Skip Setup
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className="progress-text">{currentStep} of {totalSteps}</span>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="step-title">Basic Information</h2>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                  min="13"
                  max="100"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="form-select"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Physical Stats */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="step-title">Physical Stats</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                  min="100"
                  max="250"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                  min="30"
                  max="200"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fitness Goals */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2 className="step-title">What's Your Primary Goal?</h2>
            
            <div className="goals-grid">
              {fitnessGoalOptions.map((goal) => (
                <div
                  key={goal.value}
                  className={`goal-card ${formData.fitnessGoal === goal.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('fitnessGoal', goal.value)}
                >
                  <div className="goal-icon">{goal.icon}</div>
                  <h3 className="goal-label">{goal.label}</h3>
                  <p className="goal-description">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-actions">
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={16} />
            {currentStep === 1 ? 'Back to Info' : 'Back'}
          </button>
          
          {currentStep < totalSteps ? (
            <button 
              className="btn-next primary" 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              className="btn-submit primary" 
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              Complete Profile
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
