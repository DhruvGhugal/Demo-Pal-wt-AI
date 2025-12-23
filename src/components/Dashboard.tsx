import { TrendingUp, Calendar, Target, Clock } from 'lucide-react'

interface DashboardProps {
  totalSessions: number
  averageScore: number
  totalTime: number
  weeklyGoal: number
}

export function Dashboard({ totalSessions, averageScore, totalTime, weeklyGoal }: DashboardProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const weeklyProgress = Math.min((totalTime / (weeklyGoal * 3600)) * 100, 100)
  
  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', score: 85, time: 120 },
    { day: 'Tue', score: 78, time: 95 },
    { day: 'Wed', score: 92, time: 140 },
    { day: 'Thu', score: 88, time: 110 },
    { day: 'Fri', score: 82, time: 105 },
    { day: 'Sat', score: 90, time: 85 },
    { day: 'Sun', score: 87, time: 75 },
  ]

  const maxScore = Math.max(...weeklyData.map(d => d.score))

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {/* Summary Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="panel stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-label">Total Sessions</div>
              <div className="stat-value">{totalSessions}</div>
            </div>
          </div>
        </div>

        <div className="panel stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{Math.round(averageScore)}%</div>
            </div>
          </div>
        </div>

        <div className="panel stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-label">Total Time</div>
              <div className="stat-value">{formatTime(totalTime)}</div>
            </div>
          </div>
        </div>

        <div className="panel stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div>
              <div className="stat-label">Weekly Goal</div>
              <div className="stat-value">{Math.round(weeklyProgress)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="panel">
        <h3>Weekly Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${weeklyProgress}%` }}
          ></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--muted)' }}>
          <span>{formatTime(totalTime)} completed</span>
          <span>{weeklyGoal}h goal</span>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="panel">
        <h3>Weekly Posture Scores</h3>
        <div className="chart-container">
          {weeklyData.map((day) => (
            <div key={day.day} className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${(day.score / maxScore) * 100}%`,
                  backgroundColor: day.score >= 85 ? 'var(--ok)' : day.score >= 70 ? '#eab308' : 'var(--danger)'
                }}
              ></div>
              <div className="chart-label">{day.day}</div>
              <div className="chart-value">{day.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
