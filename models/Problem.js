const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'open_ended', 'true_false', 'fill_blank'],
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
    type: mongoose.Schema.Types.Mixed, // Can be String or Array of Strings
    required: true,
    validate: {
      validator: function (answer) {
        if (Array.isArray(answer)) {
          return answer.length > 0 && answer.every(a => typeof a === 'string' && a.trim().length > 0);
        }
        return typeof answer === 'string' && answer.trim().length > 0;
      },
      message: 'Answer must be a non-empty string or array of non-empty strings'
    }
  },
  wrongAnswers: {
    type: [String],
    default: [],
    validate: {
      validator: function (answers) {
        // For multiple choice, we should have some wrong answers (but not mandatory)
        return true; // Make it more flexible - teachers can add wrong answers optionally
      },
      message: 'Wrong answers should be valid strings'
    }
  },
  img: {
    type: String,
    trim: true
  },
  imgUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (url) {
        if (!url) return true; // Optional field
        // Basic URL validation
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(url);
      },
      message: 'Please provide a valid image URL'
    }
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
