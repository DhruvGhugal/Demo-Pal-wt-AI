const mongoose = require('mongoose');

const PostureIssueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['forward_head', 'rounded_shoulders', 'leaning', 'slouching'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PostureSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  totalTime: {
    type: Number, // in seconds
    required: true,
    default: 0,
  },
  goodPostureTime: {
    type: Number, // in seconds
    required: true,
    default: 0,
  },
  averageScore: {
    type: Number, // 0-100
    required: true,
    default: 0,
    min: 0,
    max: 100,
  },
  issues: [PostureIssueSchema],
  scores: [{
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  deviceInfo: {
    userAgent: String,
    platform: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
PostureSessionSchema.index({ userId: 1, startTime: -1 });
PostureSessionSchema.index({ createdAt: -1 });

// Calculate session statistics before saving
PostureSessionSchema.pre('save', function (next) {
  if (this.endTime && !this.totalTime) {
    this.totalTime = Math.floor((this.endTime - this.startTime) / 1000);
  }
  
  // Calculate average score from scores array if available
  if (this.scores && this.scores.length > 0 && !this.averageScore) {
    const sum = this.scores.reduce((acc, s) => acc + s.score, 0);
    this.averageScore = Math.round(sum / this.scores.length);
  }
  
  next();
});

// Static method to get user statistics
PostureSessionSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalTime: { $sum: '$totalTime' },
        totalGoodPostureTime: { $sum: '$goodPostureTime' },
        averageScore: { $avg: '$averageScore' },
        bestScore: { $max: '$averageScore' },
        worstScore: { $min: '$averageScore' },
      },
    },
  ]);

  return stats[0] || {
    totalSessions: 0,
    totalTime: 0,
    totalGoodPostureTime: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
  };
};

// Static method to get sessions by date range
PostureSessionSchema.statics.getSessionsByDateRange = async function (userId, startDate, endDate) {
  return await this.find({
    userId,
    startTime: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ startTime: -1 });
};

module.exports = mongoose.model('PostureSession', PostureSessionSchema);
