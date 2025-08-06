// controllers/course.controller.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import PaidCourse from '../models/PaidCourse.js';

export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courseIds = user.purchasedCourses || []; // ✅ use fallback to []

    // Fetch full course details based on IDs in purchasedCourses
    const myCourses = await PaidCourse.find({
      _id: { $in: courseIds.filter(id => mongoose.Types.ObjectId.isValid(id)) }
    });

    res.status(200).json({ myCourses });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: "Server error" });
  }
};
