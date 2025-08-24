const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  userAnswer: {
    type: String,
    required: true,
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  comment: {
    type: String,
    trim: true
  },
  timeSpent: {
    type: Number, // in seconds
    min: 0,
    default: 0
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  attemptNumber: {
    type: Number,
    min: 1,
    default: 1
  },
  pointsEarned: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ problemId: 1 });
resultSchema.index({ userId: 1, problemId: 1 });
resultSchema.index({ assignmentId: 1 });

// Compound index for unique user-problem combination per assignment
resultSchema.index({ userId: 1, problemId: 1, assignmentId: 1 });

module.exports = mongoose.model('Result', resultSchema);
