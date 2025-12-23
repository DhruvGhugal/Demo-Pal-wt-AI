/**
 * PostureEngine - Centralized posture detection and analysis
 * All MediaPipe, webcam processing, and posture math consolidated here
 */

// ============================================
// POSTURE DETECTION CONSTANTS
// ============================================

export const POSTURE_THRESHOLDS = {
  GOOD_SCORE: 70,
  FAIR_SCORE: 50,
  HEAD_FORWARD_ANGLE: 15,
  SHOULDER_SLOUCH_ANGLE: 20,
  LEAN_ANGLE: 10,
};

export const ISSUE_TYPES = {
  FORWARD_HEAD: 'forward_head',
  ROUNDED_SHOULDERS: 'rounded_shoulders',
  LEANING: 'leaning',
  SLOUCHING: 'slouching',
};

export const SEVERITY_LEVELS = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
};

// ============================================
// WEBCAM MANAGEMENT
// ============================================

export class WebcamManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
  }

  async startCamera(videoElement, constraints = { video: { width: 640, height: 480 }, audio: false }) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement = videoElement;
      
      if (videoElement) {
        videoElement.srcObject = this.stream;
      }
      
      return this.stream;
    } catch (error) {
      console.error('Camera start error:', error);
      throw new Error(`Failed to access camera: ${error.message}`);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  isActive() {
    return this.stream !== null;
  }

  getStream() {
    return this.stream;
  }
}

// ============================================
// POSTURE ANALYSIS ENGINE
// ============================================

export class PostureAnalyzer {
  constructor(sensitivity = 0.7) {
    this.sensitivity = sensitivity;
    this.baselinePosture = null;
  }

  /**
   * Mock posture analysis - Replace with real MediaPipe/TensorFlow logic
   * @returns {Object} Posture status with score and issues
   */
  analyzeFrame() {
    // Mock analysis - generates random but realistic posture data
    const score = this.generateMockScore();
    const issues = this.detectIssues(score);
    
    return {
      isGood: score >= POSTURE_THRESHOLDS.GOOD_SCORE,
      confidence: 0.7 + Math.random() * 0.3,
      score: Math.round(score),
      timestamp: new Date(),
      issues,
    };
  }

  /**
   * Generate mock posture score (replace with real detection)
   */
  generateMockScore() {
    const baseScore = 60 + Math.random() * 40; // 60-100
    const variation = (Math.random() - 0.5) * 20; // -10 to +10
    return Math.max(0, Math.min(100, baseScore + variation));
  }

  /**
   * Detect posture issues based on score
   */
  detectIssues(score) {
    const issues = [];
    
    if (score < POSTURE_THRESHOLDS.GOOD_SCORE) {
      // Generate random issues for demo
      const issueTypes = [
        ISSUE_TYPES.FORWARD_HEAD,
        ISSUE_TYPES.ROUNDED_SHOULDERS,
        ISSUE_TYPES.SLOUCHING,
        ISSUE_TYPES.LEANING,
      ];
      
      const numIssues = score < POSTURE_THRESHOLDS.FAIR_SCORE ? 2 : 1;
      
      for (let i = 0; i < numIssues; i++) {
        const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
        issues.push(this.createIssue(randomType, score));
      }
    }
    
    return issues;
  }

  /**
   * Create posture issue object
   */
  createIssue(type, score) {
    const severity = this.calculateSeverity(score);
    const messages = {
      [ISSUE_TYPES.FORWARD_HEAD]: 'Head is tilted forward',
      [ISSUE_TYPES.ROUNDED_SHOULDERS]: 'Shoulders are rounded',
      [ISSUE_TYPES.SLOUCHING]: 'Slouching detected',
      [ISSUE_TYPES.LEANING]: 'Leaning to one side',
    };
    
    return {
      type,
      severity,
      message: messages[type] || 'Posture issue detected',
      timestamp: new Date(),
    };
  }

  /**
   * Calculate severity based on score
   */
  calculateSeverity(score) {
    if (score >= POSTURE_THRESHOLDS.FAIR_SCORE) {
      return SEVERITY_LEVELS.MILD;
    } else if (score >= 30) {
      return SEVERITY_LEVELS.MODERATE;
    } else {
      return SEVERITY_LEVELS.SEVERE;
    }
  }

  /**
   * Update sensitivity setting
   */
  setSensitivity(sensitivity) {
    this.sensitivity = Math.max(0.1, Math.min(1.0, sensitivity));
  }

  /**
   * Set baseline posture for comparison
   */
  setBaseline(postureData) {
    this.baselinePosture = postureData;
  }
}

// ============================================
// SESSION TRACKER
// ============================================

export class SessionTracker {
  constructor() {
    this.currentSession = null;
    this.sessionHistory = [];
  }

  /**
   * Start new tracking session
   */
  startSession() {
    this.currentSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      totalTime: 0,
      goodPostureTime: 0,
      averageScore: 0,
      scores: [],
      issues: [],
    };
    
    return this.currentSession;
  }

  /**
   * Update session with new posture data
   */
  updateSession(postureStatus) {
    if (!this.currentSession) return null;
    
    const now = new Date();
    const elapsed = Math.floor((now - this.currentSession.startTime) / 1000);
    
    this.currentSession.totalTime = elapsed;
    this.currentSession.scores.push({
      score: postureStatus.score,
      timestamp: now,
    });
    
    if (postureStatus.isGood) {
      this.currentSession.goodPostureTime += 2; // Assuming 2-second intervals
    }
    
    if (postureStatus.issues.length > 0) {
      this.currentSession.issues.push(...postureStatus.issues);
    }
    
    // Calculate average score
    const totalScore = this.currentSession.scores.reduce((sum, s) => sum + s.score, 0);
    this.currentSession.averageScore = Math.round(totalScore / this.currentSession.scores.length);
    
    return this.currentSession;
  }

  /**
   * End current session
   */
  endSession() {
    if (!this.currentSession) return null;
    
    this.currentSession.endTime = new Date();
    this.sessionHistory.push({ ...this.currentSession });
    
    const completedSession = this.currentSession;
    this.currentSession = null;
    
    return completedSession;
  }

  /**
   * Get current session
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Get session history
   */
  getHistory() {
    return this.sessionHistory;
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.sessionHistory = [];
  }
}

// ============================================
// STATISTICS CALCULATOR
// ============================================

export class StatsCalculator {
  /**
   * Calculate overall statistics from sessions
   */
  static calculateOverallStats(sessions) {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        totalGoodPostureTime: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        posturePercentage: 0,
      };
    }
    
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((sum, s) => sum + s.totalTime, 0);
    const totalGoodPostureTime = sessions.reduce((sum, s) => sum + s.goodPostureTime, 0);
    const averageScore = sessions.reduce((sum, s) => sum + s.averageScore, 0) / totalSessions;
    const bestScore = Math.max(...sessions.map(s => s.averageScore));
    const worstScore = Math.min(...sessions.map(s => s.averageScore));
    const posturePercentage = totalTime > 0 ? (totalGoodPostureTime / totalTime) * 100 : 0;
    
    return {
      totalSessions,
      totalTime,
      totalGoodPostureTime,
      averageScore: Math.round(averageScore),
      bestScore,
      worstScore,
      posturePercentage: Math.round(posturePercentage),
    };
  }

  /**
   * Format time in seconds to readable format
   */
  static formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Get weekly progress data
   */
  static getWeeklyProgress(sessions) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklySessions = sessions.filter(s => new Date(s.startTime) >= weekAgo);
    
    return this.calculateOverallStats(weeklySessions);
  }
}

// ============================================
// EXPORT SINGLETON INSTANCES
// ============================================

export const webcamManager = new WebcamManager();
export const postureAnalyzer = new PostureAnalyzer();
export const sessionTracker = new SessionTracker();
