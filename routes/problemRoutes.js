const express = require('express');
const router = express.Router();

// Placeholder routes for Railway deployment
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Problems API endpoint - Coming soon!',
    data: { problems: [] }
  });
});

router.get('/topics', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Topics API endpoint - Coming soon!',
    data: { topics: ['algebra', 'geometry', 'calculus'] }
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    success: false, 
    message: 'Problem detail endpoint - Coming soon!' 
  });
});

module.exports = router;
