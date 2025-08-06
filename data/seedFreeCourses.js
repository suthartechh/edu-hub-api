// seedFreeCourses.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import paidCoursesData from './paidCoursesData.js';
import PaidCourse from '../models/PaidCourse.js';

// Load .env from parent directory
dotenv.config({ path: '../.env' });

console.log("✅ MONGODB_URI:", process.env.MONGODB_URI); // Debug

const seedFreeCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await PaidCourse.deleteMany();
    console.log('🗑️ Old courses removed');

    await PaidCourse.insertMany(paidCoursesData);
    console.log('✅ Data seeded successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Failed to seed data:', error);
    process.exit(1);
  }
};

seedFreeCourses();
