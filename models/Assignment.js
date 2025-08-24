const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  }],
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allowMultipleAttempts: {
    type: Boolean,
    default: false
  },
  maxAttempts: {
    type: Number,
    min: 1,
    default: 1
  },
  timeLimit: {
    type: Number, // in minutes
    min: 1
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  randomizeQuestions: {
    type: Boolean,
    default: false
  },
  totalPoints: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total points before saving
assignmentSchema.pre('save', async function(next) {
  if (this.isModified('problems')) {
    try {
      const Problem = mongoose.model('Problem');
      const problems = await Problem.find({ _id: { $in: this.problems } });
      this.totalPoints = problems.reduce((sum, problem) => sum + (problem.points || 1), 0);
    } catch (error) {
      // If can't calculate, set to problems count
      this.totalPoints = this.problems.length;
    }
  }
  next();
});

// Index for faster queries
assignmentSchema.index({ teacherId: 1, createdAt: -1 });
assignmentSchema.index({ assignedTo: 1, dueDate: 1 });
assignmentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
