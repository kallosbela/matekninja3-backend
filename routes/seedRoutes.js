const express = require('express');
const seedDatabase = require('../scripts/seedDatabase');

const router = express.Router();

// @route   POST /api/seed
// @desc    Seed database with sample data
// @access  Public (remove in production!)
router.post('/', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding via API...');
    
    // Close existing connection if any
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    
    await seedDatabase();
    
    res.json({
      success: true,
      message: 'Database seeded successfully! Check server logs for details.',
      data: {
        users: 'Created 6 users (2 teachers, 4 students)',
        problems: 'Created 9 problems across 3 topics',
        assignments: 'Created 2 assignments',
        results: 'Created 3 sample results'
      }
    });
  } catch (error) {
    console.error('Seed API error:', error);
    res.status(500).json({
      success: false,
      message: 'Database seeding failed',
      error: error.message
    });
  }
});

// @route   GET /api/seed/info
// @desc    Get seeding information
// @access  Public
router.get('/info', (req, res) => {
  res.json({
    success: true,
    message: 'Database seeding endpoint',
    instructions: [
      '1. POST /api/seed - Run database seeding',
      '2. Check server logs for detailed output',
      '3. Test users created with password: password123'
    ],
    testUsers: {
      teachers: [
        'kovacs_anna@teszt.hu',
        'nagy_peter@teszt.hu'
      ],
      students: [
        'toth.balazs@teszt.hu',
        'varga.eszter@teszt.hu',
        'horvath.daniel@teszt.hu',
        'kiss.zsofia@teszt.hu'
      ]
    }
  });
});

module.exports = router;
