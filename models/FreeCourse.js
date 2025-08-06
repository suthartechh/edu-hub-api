// models/FreeCourse.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  id: { type: Number },
  thumbnail: String,
  description: String,
  title: String,
  url: String,
  duration: String,
}, { _id: false });

const contentSchema = new mongoose.Schema({
  id: { type: Number },
  title: String,
  image: String,
  video: [videoSchema],
});

const freeCourseSchema = new mongoose.Schema({
  id: { type: Number },
  title: String,
  shortBio: String,
  image: String,
  contentData: [contentSchema],
});

const FreeCourse = mongoose.model('FreeCourse', freeCourseSchema);
export default FreeCourse;
