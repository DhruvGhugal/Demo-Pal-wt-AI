import { Play, Activity } from 'lucide-react'

interface LandingScreenProps {
  onStart: () => void
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="landing-screen">
      <div className="landing-content">
        {/* Animated Logo */}
        <div className="landing-logo">
          <div className="logo-icon">
            <Activity size={64} />
          </div>
          <h1 className="landing-title">
            PosturePal
          </h1>
          <p className="landing-subtitle">
            AI-Powered Posture & Fitness Tracking
          </p>
        </div>

        {/* Animated Background Elements */}
        <div className="landing-animation">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="pulse-ring ring-1"></div>
          <div className="pulse-ring ring-2"></div>
        </div>

        {/* Features Preview */}
        <div className="landing-features">
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <span>Real-time Monitoring</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <span>Personalized Workouts</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <span>Progress Tracking</span>
          </div>
        </div>

        {/* Main CTA Button */}
        <button 
          className="landing-cta"
          onClick={onStart}
        >
          <Play size={24} />
          Let's Start
        </button>

        {/* Footer Text */}
        <p className="landing-footer">
          Start your PosturePal journey today
        </p>
      </div>
    </div>
  )
}
