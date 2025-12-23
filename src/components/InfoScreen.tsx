import { ArrowRight, ArrowLeft, Target, TrendingUp, Shield, Clock } from 'lucide-react'

interface InfoScreenProps {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function InfoScreen({ onNext, onBack, onSkip }: InfoScreenProps) {
  const features = [
    {
      icon: <Target size={32} />,
      title: "Posture Correction",
      description: "Real-time AI analysis helps you maintain perfect posture during workouts and daily activities."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and personalized insights."
    },
    {
      icon: <Shield size={32} />,
      title: "Injury Prevention",
      description: "Smart form detection helps prevent injuries by correcting improper exercise techniques."
    },
    {
      icon: <Clock size={32} />,
      title: "Flexible Workouts",
      description: "Choose from various workout durations that fit perfectly into your busy schedule."
    }
  ]

  const benefits = [
    "Improved spinal alignment and posture",
    "Reduced back and neck pain",
    "Enhanced core strength and stability",
    "Better breathing and energy levels",
    "Increased confidence and presence"
  ]

  return (
    <div className="info-screen">
      <div className="info-content">
        <div className="info-header">
          <h1 className="info-title">
            Welcome to <span className="accent-text">PosturePal</span>
            <br />Your AI Posture Companion
          </h1>
          <p className="info-description">
            PosturePal combines cutting-edge AI technology with personalized posture tracking 
            to help you build better posture habits and achieve your health goals.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="benefits-section">
          <h2 className="benefits-title">Benefits You'll Experience</h2>
          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span className="benefit-check">✓</span>
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-navigation">
          <button className="info-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          
          <button className="info-skip-btn" onClick={onSkip}>
            Skip to App
          </button>
          
          <button className="info-next-btn" onClick={onNext}>
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="info-stats">
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Posture Monitoring</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">90%</div>
            <div className="stat-label">Improvement Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2 Weeks</div>
            <div className="stat-label">Average Results</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Exercise Variations</div>
          </div>
        </div>
      </div>
    </div>
  )
}
