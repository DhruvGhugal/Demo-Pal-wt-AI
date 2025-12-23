const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  age: {
    type: Number,
    min: 1,
    max: 150,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  height: {
    type: Number, // in cm
    min: 0,
  },
  weight: {
    type: Number, // in kg
    min: 0,
  },
  fitnessGoal: {
    type: String,
    enum: ['strength', 'flexibility', 'posture_correction', 'endurance'],
    default: 'posture_correction',
  },
  settings: {
    reminderInterval: {
      type: Number,
      default: 15, // minutes
    },
    sensitivity: {
      type: Number,
      default: 0.7,
      min: 0.1,
      max: 1.0,
    },
    enableReminders: {
      type: Boolean,
      default: true,
    },
    enableCamera: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp
UserSchema.methods.updateLastActive = async function () {
  this.lastActive = Date.now();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
