// models/PaidCourse.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  id: Number,
  thumbnail: String,
  description: String,
  title: String,
  url: String,
  duration: String,
}, { _id: false });

const contentSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  video: [videoSchema]
}, { _id: false });

const paidCourseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  shortBio: String,
  price: Number,
  discount: Number,
  discountPrice: Number,
  duration: String,
  category: String,
  isPaid: Boolean,
  isPurchased: Boolean,
  offerEndsAt: Date,
  image: String,
  demoContentData: [contentSchema],
  contentData: [contentSchema],
}, {
  collection: 'paidCourses',
  timestamps: true,
});

const PaidCourse = mongoose.model('PaidCourse', paidCourseSchema);
export default PaidCourse;
