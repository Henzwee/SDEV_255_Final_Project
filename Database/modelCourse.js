const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId() // Generate a unique ObjectId
  },
  courseName: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  creditHours: {  
    type: Number,
    required: true,
    min: 1, 
    max: 6  
  },
  description: {
    type: String
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;