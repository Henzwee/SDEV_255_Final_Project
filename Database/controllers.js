const Course = require('./modelCourse'); // Ensure this matches the actual path

// Fetch all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    // Ensure all returned courses include `creditHours`
    const updatedCourses = courses.map(course => ({
      ...course._doc, 
      creditHours: course.creditHours || 3  // Default to 3 if missing
    }));

    res.json(updatedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new course
exports.addCourse = async (req, res) => {
  try {
    const { courseName, teacher, creditHours, description } = req.body;

    // Validate creditHours or set default
    const validatedCreditHours = creditHours ? parseInt(creditHours, 10) : 3;

    const newCourse = new Course({
      courseName,
      teacher,
      creditHours: validatedCreditHours, // Ensure it's stored
      description
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
