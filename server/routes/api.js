const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PostureSession = require('../models/PostureSession');
const { protect, generateToken } = require('../middleware/auth');

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, fitnessGoal } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      fitnessGoal,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        fitnessGoal: user.fitnessGoal,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    await user.updateLastActive();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        fitnessGoal: user.fitnessGoal,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/auth/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        gender: req.user.gender,
        height: req.user.height,
        weight: req.user.weight,
        fitnessGoal: req.user.fitnessGoal,
        settings: req.user.settings,
        createdAt: req.user.createdAt,
        lastActive: req.user.lastActive,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, gender, height, weight, fitnessGoal } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        fitnessGoal: user.fitnessGoal,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SETTINGS ROUTES
// ============================================

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  try {
    const { reminderInterval, sensitivity, enableReminders, enableCamera } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update settings
    if (reminderInterval !== undefined) user.settings.reminderInterval = reminderInterval;
    if (sensitivity !== undefined) user.settings.sensitivity = sensitivity;
    if (enableReminders !== undefined) user.settings.enableReminders = enableReminders;
    if (enableCamera !== undefined) user.settings.enableCamera = enableCamera;

    await user.save();

    res.json({
      success: true,
      settings: user.settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      settings: req.user.settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// POSTURE SESSION ROUTES
// ============================================

// @route   POST /api/sessions
// @desc    Create new posture session
// @access  Private
router.post('/sessions', protect, async (req, res) => {
  try {
    const { startTime, endTime, totalTime, goodPostureTime, averageScore, issues, scores } = req.body;

    const session = await PostureSession.create({
      userId: req.user._id,
      startTime,
      endTime,
      totalTime,
      goodPostureTime,
      averageScore,
      issues,
      scores,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'] || 'unknown',
      },
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/sessions
// @desc    Get all user sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const sessions = await PostureSession.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await PostureSession.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await PostureSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete session
// @access  Private
router.delete('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await PostureSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      message: 'Session deleted',
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await PostureSession.getUserStats(req.user._id);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/sessions/date-range
// @desc    Get sessions by date range
// @access  Private
router.get('/sessions/range/:startDate/:endDate', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    
    const sessions = await PostureSession.getSessionsByDateRange(
      req.user._id,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Get sessions by range error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/data
// @desc    Delete all user data
// @access  Private
router.delete('/data', protect, async (req, res) => {
  try {
    // Delete all sessions
    await PostureSession.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'All data deleted',
    });
  } catch (error) {
    console.error('Delete data error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
