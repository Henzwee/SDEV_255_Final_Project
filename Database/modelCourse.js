const mongoose = require('mongoose');
// model for the course form
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;