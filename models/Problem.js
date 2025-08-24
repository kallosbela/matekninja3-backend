const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'short_answer'],
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  wrongAnswers: {
    type: [String],
    default: [],
    validate: {
      validator: function (answers) {
        // For multiple choice, we need at least 2 wrong answers
        if (this.type === 'multiple_choice') {
          return answers && answers.length >= 2;
        }
        return true;
      },
      message: 'Multiple choice questions must have at least 2 wrong answers'
    }
  },
  img: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
problemSchema.index({ topic: 1, type: 1 });
problemSchema.index({ createdBy: 1 });
problemSchema.index({ isActive: 1 });

module.exports = mongoose.model('Problem', problemSchema);
