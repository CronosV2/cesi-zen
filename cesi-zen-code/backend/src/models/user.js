const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1
  },
  stressLevel: {
    type: Number,
    default: 0
  },
  healthStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  achievements: [{
    name: String,
    unlockedAt: Date
  }],
  meditationTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);