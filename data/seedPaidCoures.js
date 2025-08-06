// seeders/seedPaidCourses.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaidCourse from '../models/PaidCourse.js';

dotenv.config();

const paidCoursesData = [/* your full JSON array goes here */];

const seedPaidCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await PaidCourse.deleteMany(); // Optional: clears old data
    await PaidCourse.insertMany(paidCoursesData);
    console.log('✅ Paid courses seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding paid courses:', error);
    process.exit(1);
  }
};

seedPaidCourses();
