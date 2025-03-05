const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Étudiant CESI"
  },
  level: {
    type: Number,
    default: 5
  },
  exercicesCompleted: {
    type: Number,
    default: 15
  },
  stressLevel: {
    type: String,
    default: "Enorme"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);