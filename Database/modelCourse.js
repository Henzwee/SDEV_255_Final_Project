const mongoose = require('mongoose');

// Model for the course form
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  creditHours: {  // <-- Added Credit Hours field
    type: Number,
    required: true,
    min: 1, // Ensure at least 1 credit hour
    max: 6  // Set a reasonable max limit
  },
  description: {
    type: String
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;