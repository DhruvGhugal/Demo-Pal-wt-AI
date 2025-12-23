export interface PostureStatus {
  isGood: boolean
  confidence: number
  timestamp: Date
  issues: PostureIssue[]
}

export interface PostureIssue {
  type: 'forward_head' | 'rounded_shoulders' | 'leaning' | 'slouching'
  severity: 'mild' | 'moderate' | 'severe'
  message: string
}

export interface PostureSession {
  id: string
  startTime: Date
  endTime?: Date
  totalTime: number // in seconds
  goodPostureTime: number // in seconds
  averageScore: number
  issues: PostureIssue[]
}

export interface PostureSettings {
  reminderInterval: number // in minutes
  sensitivitiy: number // 0.1 to 1.0
  enableReminders: boolean
  enableCamera: boolean
}

export interface CameraState {
  isEnabled: boolean
  isLoading: boolean
  error: string | null
  stream: MediaStream | null
}

export interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  weight: number // in kg
  fitnessGoal: 'strength' | 'flexibility' | 'posture_correction' | 'endurance'
  createdAt: Date
}

export interface Exercise {
  id: string
  name: string
  description: string
  category: 'posture' | 'strength' | 'flexibility' | 'cardio'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in seconds per set
  sets: number
  targetMuscles: string[]
  instructions: string[]
  benefits: string[]
}

export interface ExerciseSession {
  id: string
  exerciseId: string
  exerciseName: string
  startTime: Date
  endTime?: Date
  completedSets: number
  targetSets: number
  feedback: ExerciseFeedback[]
  overallScore: number
}

export interface ExerciseFeedback {
  timestamp: Date
  type: 'good' | 'warning' | 'correction'
  message: string
  confidence: number
}

export type AppScreen = 'landing' | 'info' | 'profile' | 'exercises' | 'monitoring' | 'summary' | 'dashboard'
