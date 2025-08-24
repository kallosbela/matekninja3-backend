const express = require('express');
const router = express.Router();
const {
  getStudents,
  createProblem,
  getMyProblems,
  bulkUploadProblems,
  createAssignment,
  getMyAssignments,
  getAssignmentResults
} = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const teacherMiddleware = require('../middleware/teacherMiddleware');

// Apply auth and teacher middleware to all routes
router.use(authMiddleware);
router.use(teacherMiddleware);

// Student management
router.get('/students', getStudents);

// Problem management
router.post('/problems', createProblem);
router.get('/problems', getMyProblems);
router.post('/problems/bulk', bulkUploadProblems);

// Assignment management
router.post('/assignments', createAssignment);
router.get('/assignments', getMyAssignments);
router.get('/assignments/:id/results', getAssignmentResults);

module.exports = router;
