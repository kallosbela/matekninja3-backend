const Assignment = require('../models/Assignment');
const Result = require('../models/Result');

// Get assignments assigned to the current user (student)
const getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      assignedTo: req.user.id
    })
      .populate('teacherId', 'username email')
      .populate('problems', 'question topic difficulty points type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Assignments retrieved successfully',
      data: { assignments }
    });
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
};

// Get specific assignment details for student
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOne({
      _id: id,
      assignedTo: req.user.id
    })
      .populate('teacherId', 'username email')
      .populate('problems');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or not assigned to you'
      });
    }

    // Get user's existing results for this assignment
    const results = await Result.find({
      userId: req.user.id,
      problemId: { $in: assignment.problems.map(p => p._id) }
    });

    res.json({
      success: true,
      message: 'Assignment retrieved successfully',
      data: {
        assignment,
        results
      }
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment',
      error: error.message
    });
  }
};

module.exports = {
  getMyAssignments,
  getAssignmentById
};
