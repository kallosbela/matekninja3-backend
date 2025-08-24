const User = require('../models/User');
const Problem = require('../models/Problem');
const Assignment = require('../models/Assignment');
const Result = require('../models/Result');

// Get all students for teacher
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ username: 1 });

    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: { students }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const { type, topic, question, answer, wrongAnswers, img, imgUrl, difficulty, points } = req.body;

    if (!type || !topic || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Type, topic, question, and answer are required'
      });
    }

    const problem = new Problem({
      type,
      topic,
      question,
      answer,
      wrongAnswers: wrongAnswers || [],
      img,
      imgUrl,
      createdBy: req.user.id,
      difficulty: difficulty || 'medium',
      points: points || 10
    });

    const savedProblem = await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: { problem: savedProblem }
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating problem',
      error: error.message
    });
  }
};

// Get teacher's problems
const getMyProblems = async (req, res) => {
  try {
    const { topic, difficulty, page = 1, limit = 10 } = req.query;

    const filter = { createdBy: req.user.id };
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      message: 'Problems retrieved successfully',
      data: {
        problems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
};

// Bulk upload problems
const bulkUploadProblems = async (req, res) => {
  try {
    const { problems } = req.body;

    if (!problems || !Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Problems array is required'
      });
    }

    // Validate each problem
    const validProblems = problems.map(problem => ({
      ...problem,
      createdBy: req.user.id,
      difficulty: problem.difficulty || 'medium',
      points: problem.points || 10,
      wrongAnswers: problem.wrongAnswers || []
    }));

    const savedProblems = await Problem.insertMany(validProblems);

    res.status(201).json({
      success: true,
      message: `${savedProblems.length} problems uploaded successfully`,
      data: { problems: savedProblems }
    });
  } catch (error) {
    console.error('Error bulk uploading problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk uploading problems',
      error: error.message
    });
  }
};

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, problems, assignedTo, dueDate, settings } = req.body;

    if (!title || !problems || problems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and problems are required'
      });
    }

    const assignment = new Assignment({
      title,
      description,
      teacherId: req.user.id,
      problems,
      assignedTo: assignedTo || [],
      dueDate,
      settings: settings || {}
    });

    const savedAssignment = await assignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: { assignment: savedAssignment }
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating assignment',
      error: error.message
    });
  }
};

// Get teacher's assignments
const getMyAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const assignments = await Assignment.find({ teacherId: req.user.id })
      .populate('problems', 'question topic difficulty points')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Assignment.countDocuments({ teacherId: req.user.id });

    res.json({
      success: true,
      message: 'Assignments retrieved successfully',
      data: {
        assignments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
};

// Get assignment results
const getAssignmentResults = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOne({
      _id: id,
      teacherId: req.user.id
    }).populate('problems', 'question topic difficulty points');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const results = await Result.find({
      problemId: { $in: assignment.problems.map(p => p._id) }
    }).populate('userId', 'username email')
      .populate('problemId', 'question topic difficulty points')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Assignment results retrieved successfully',
      data: {
        assignment,
        results
      }
    });
  } catch (error) {
    console.error('Error fetching assignment results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment results',
      error: error.message
    });
  }
};

module.exports = {
  getStudents,
  createProblem,
  getMyProblems,
  bulkUploadProblems,
  createAssignment,
  getMyAssignments,
  getAssignmentResults
};
