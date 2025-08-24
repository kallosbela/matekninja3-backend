require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Assignment = require('../models/Assignment');
const Result = require('../models/Result');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    // Kapcsolódás az adatbázishoz (ha még nincs)
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    console.log('🌱 Database seeding started...');

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Assignment.deleteMany({});
    await Result.deleteMany({});
    console.log('🧹 Cleared existing data');

    // 1. Teszt felhasználók létrehozása
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
      },
      {
        username: 'horvath_daniel',
        email: 'horvath.daniel@teszt.hu',
        password: 'password123',
        role: 'student'
      },
      {
        username: 'kiss_zsofia',
        email: 'kiss.zsofia@teszt.hu',
        password: 'password123',
        role: 'student'
      }
    ]);

    console.log(`✅ Created ${students.length + 2} users (2 teachers, ${students.length} students)`);

    // 2. Algebra feladatok létrehozása
    const algebraProblems = await Problem.create([
      {
        type: 'multiple_choice',
        topic: 'algebra',
        question: 'Mi az eredménye a következő egyenletnek: $2x + 3 = 7$?',
        answer: 'x = 2',
        wrongAnswers: ['x = 1', 'x = 3', 'x = 4'],
        createdBy: teacher1._id,
        difficulty: 'easy',
        points: 1
      },
      {
        type: 'short_answer',
        topic: 'algebra',
        question: 'Oldja meg az egyenletet: $3x - 5 = 16$',
        answer: '7',
        createdBy: teacher1._id,
        difficulty: 'easy',
        points: 2
      },
      {
        type: 'multiple_choice',
        topic: 'algebra',
        question: 'Mennyi az $(x+2)^2$ kifejezés kifejtve?',
        answer: '$x^2 + 4x + 4$',
        wrongAnswers: ['$x^2 + 2x + 4$', '$x^2 + 4x + 2$', '$x^2 + 2x + 2$'],
        createdBy: teacher1._id,
        difficulty: 'medium',
        points: 3
      }
    ]);

    // 3. Geometria feladatok létrehozása
    const geometryProblems = await Problem.create([
      {
        type: 'short_answer',
        topic: 'geometria',
        question: 'Mennyi egy négyzet területe, ha az oldala 5 cm?',
        answer: '25',
        createdBy: teacher2._id,
        difficulty: 'easy',
        points: 1
      },
      {
        type: 'multiple_choice',
        topic: 'geometria',
        question: 'Mennyi egy kör területe, ha a sugara 3 cm? (π ≈ 3.14)',
        answer: '28.26',
        wrongAnswers: ['18.84', '9.42', '6.28'],
        createdBy: teacher2._id,
        difficulty: 'medium',
        points: 2
      },
      {
        type: 'short_answer',
        topic: 'geometria',
        question: 'Egy derékszögű háromszög befogói 3 cm és 4 cm. Mennyi az átfogó hossza?',
        answer: '5',
        createdBy: teacher2._id,
        difficulty: 'medium',
        points: 3
      }
    ]);

    // 4. Számtan feladatok létrehozása
    const arithmeticProblems = await Problem.create([
      {
        type: 'multiple_choice',
        topic: 'számtan',
        question: 'Mennyi 7 × 8?',
        answer: '56',
        wrongAnswers: ['48', '54', '64'],
        createdBy: teacher1._id,
        difficulty: 'easy',
        points: 1
      },
      {
        type: 'short_answer',
        topic: 'számtan',
        question: 'Mennyi 125 ÷ 5?',
        answer: '25',
        createdBy: teacher1._id,
        difficulty: 'easy',
        points: 1
      },
      {
        type: 'multiple_choice',
        topic: 'számtan',
        question: 'Mennyi 15% × 200?',
        answer: '30',
        wrongAnswers: ['20', '25', '35'],
        createdBy: teacher2._id,
        difficulty: 'medium',
        points: 2
      }
    ]);

    const allProblems = [...algebraProblems, ...geometryProblems, ...arithmeticProblems];
    console.log(`✅ Created ${allProblems.length} problems across 3 topics`);

    // 5. Feladatsorok létrehozása
    const assignment1 = await Assignment.create({
      title: 'Alapszintű algebra',
      description: 'Egyszerű algebrai egyenletek gyakorlása',
      teacherId: teacher1._id,
      problems: [algebraProblems[0]._id, algebraProblems[1]._id],
      assignedTo: [students[0]._id, students[1]._id],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      allowMultipleAttempts: true,
      maxAttempts: 3,
      showCorrectAnswers: true
    });

    const assignment2 = await Assignment.create({
      title: 'Geometria alapok',
      description: 'Terület és kerület számítás',
      teacherId: teacher2._id,
      problems: [geometryProblems[0]._id, geometryProblems[1]._id],
      assignedTo: [students[2]._id, students[3]._id],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      allowMultipleAttempts: false,
      maxAttempts: 1,
      showCorrectAnswers: false
    });

    console.log(`✅ Created 2 assignments`);

    // 6. Néhány teszt eredmény létrehozása
    const results = await Result.create([
      {
        userId: students[0]._id,
        problemId: algebraProblems[0]._id,
        userAnswer: 'x = 2',
        isCorrect: true,
        timeSpent: 45,
        assignmentId: assignment1._id,
        pointsEarned: 1
      },
      {
        userId: students[0]._id,
        problemId: algebraProblems[1]._id,
        userAnswer: '6',
        isCorrect: false,
        timeSpent: 120,
        assignmentId: assignment1._id,
        pointsEarned: 0
      },
      {
        userId: students[1]._id,
        problemId: algebraProblems[0]._id,
        userAnswer: 'x = 2',
        isCorrect: true,
        timeSpent: 30,
        assignmentId: assignment1._id,
        pointsEarned: 1
      }
    ]);

    console.log(`✅ Created ${results.length} sample results`);

    // 7. Adatbázis statisztikák
    const userCount = await User.countDocuments();
    const problemCount = await Problem.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const resultCount = await Result.countDocuments();

    // 8. Collections ellenőrzése
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n📊 Létrehozott collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    console.log('\n📈 Adatbázis statisztikák:');
    console.log(`   - Felhasználók: ${userCount} (2 tanár, ${userCount-2} diák)`);
    console.log(`   - Feladatok: ${problemCount} (algebra: ${algebraProblems.length}, geometria: ${geometryProblems.length}, számtan: ${arithmeticProblems.length})`);
    console.log(`   - Feladatsorok: ${assignmentCount}`);
    console.log(`   - Eredmények: ${resultCount}`);

    console.log('\n🎓 Teszt felhasználók:');
    console.log('   Tanárok:');
    console.log('     - kovacs_anna@teszt.hu / password123');
    console.log('     - nagy_peter@teszt.hu / password123');
    console.log('   Diákok:');
    console.log('     - toth.balazs@teszt.hu / password123');
    console.log('     - varga.eszter@teszt.hu / password123');
    console.log('     - horvath.daniel@teszt.hu / password123');
    console.log('     - kiss.zsofia@teszt.hu / password123');

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  } finally {
    // Kapcsolat bezárása csak ha scriptként fut
    if (require.main === module) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
      process.exit(0);
    }
  }
};

// Script futtatása
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
