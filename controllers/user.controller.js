import mongoose from "mongoose";
import User from "../models/User.js";

export const buyCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Validate userId and courseId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid userId or courseId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if course is already purchased
    const alreadyBought = user.purchasedCourses.some(course =>
      course.equals(courseId)
    );
    if (alreadyBought) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Add course to purchasedCourses
    user.purchasedCourses.push(new mongoose.Types.ObjectId(courseId));
    await user.save();

    res.status(200).json({
      message: "Course purchased successfully",
      purchasedCourses: user.purchasedCourses,
    });
  } catch (err) {
    console.error("Buy Course Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
