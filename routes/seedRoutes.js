const express = require('express');
const seedDatabase = require('../scripts/seedDatabase');

const router = express.Router();

// @route   POST /api/seed
// @desc    Seed database with sample data
// @access  Public (remove in production!)
router.post('/', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding via API...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    console.log('Connection state:', require('mongoose').connection.readyState);
    
    const mongoose = require('mongoose');
    const User = require('../models/User');
    const Problem = require('../models/Problem');
    const Assignment = require('../models/Assignment');
    const Result = require('../models/Result');
    
    // Ensure we're connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB not connected, attempting to connect...');
      const connectDB = require('../config/database');
      await connectDB();
    }
    
    console.log('✅ MongoDB connection ready');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Assignment.deleteMany({});
    await Result.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('👥 Creating users...');
    const teacher1 = await User.create({
      username: 'kovacs_anna',
      email: 'kovacs.anna@teszt.hu',
      password: 'password123',
      role: 'teacher'
    });

    const teacher2 = await User.create({
      username: 'nagy_peter',
      email: 'nagy.peter@teszt.hu',
      password: 'password123',
      role: 'teacher'
    });

    const students = await User.create([
      {
        username: 'toth_balazs',
        email: 'toth.balazs@teszt.hu',
        password: 'password123',
        role: 'student'
      },
      {
        username: 'varga_eszter',
        email: 'varga.eszter@teszt.hu',
        password: 'password123',
        role: 'student'
      }
    ]);

    console.log(`✅ Created ${students.length + 2} users`);

    // Create problems
    console.log('📚 Creating problems...');
    const problems = await Problem.create([
      {
        type: 'multiple_choice',
        topic: 'algebra',
        question: 'Mi az eredménye a következő egyenletnek: 2x + 3 = 7?',
        answer: 'x = 2',
        wrongAnswers: ['x = 1', 'x = 3', 'x = 4'],
        createdBy: teacher1._id,
        difficulty: 'easy',
        points: 1
      },
      {
        type: 'short_answer',
        topic: 'geometria',
        question: 'Mennyi egy négyzet területe, ha az oldala 5 cm?',
        answer: '25',
        createdBy: teacher2._id,
        difficulty: 'easy',
        points: 1
      }
    ]);

    console.log(`✅ Created ${problems.length} problems`);

    // Verify data
    const userCount = await User.countDocuments();
    const problemCount = await Problem.countDocuments();
    
    console.log(`📊 Final count - Users: ${userCount}, Problems: ${problemCount}`);
    
    res.json({
      success: true,
      message: 'Database seeded successfully! Data verified.',
      data: {
        users: userCount,
        problems: problemCount,
        mongoUri: process.env.MONGO_URI ? 'Connected' : 'Not set',
        connectionState: mongoose.connection.readyState
      }
    });
  } catch (error) {
    console.error('❌ Seed API error:', error);
    res.status(500).json({
      success: false,
      message: 'Database seeding failed',
      error: error.message,
      stack: error.stack
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

// @route   GET /api/seed/check
// @desc    Check database contents
// @access  Public
router.get('/check', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('../models/User');
    const Problem = require('../models/Problem');
    const Assignment = require('../models/Assignment');
    const Result = require('../models/Result');
    
    // Check connection
    const connectionState = mongoose.connection.readyState;
    const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Count documents
    const userCount = await User.countDocuments();
    const problemCount = await Problem.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const resultCount = await Result.countDocuments();
    
    // Get collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Sample users
    const sampleUsers = await User.find({}).limit(3).select('username email role');
    
    res.json({
      success: true,
      message: 'Database status check',
      data: {
        connection: {
          state: stateNames[connectionState] || 'unknown',
          stateCode: connectionState,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        counts: {
          users: userCount,
          problems: problemCount,
          assignments: assignmentCount,
          results: resultCount
        },
        collections: collectionNames,
        sampleUsers: sampleUsers,
        environment: {
          mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
          nodeEnv: process.env.NODE_ENV
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database check failed',
      error: error.message
    });
  }
});

module.exports = router;
