const express = require('express');
const router = express.Router();
const {
  getMyAssignments,
  getAssignmentById
} = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get assignments assigned to current user
router.get('/', getMyAssignments);

// Get specific assignment details
router.get('/:id', getAssignmentById);

module.exports = router;
