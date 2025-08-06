
import PaidCourse from "../models/PaidCourse.js";

export const getPaidCourses = async (req, res) => {
  try {
    const courses = await PaidCourse.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
