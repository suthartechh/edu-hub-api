// controllers/freeCourses.controller.js
import FreeCourse from '../models/FreeCourse.js';

export const getFreeCourses = async (req, res) => {
  try {
    const courses = await FreeCourse.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
