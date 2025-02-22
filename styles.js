const binUrl = "https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97"; // JSONBin URL
const masterKey = "$2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W"; // Master key

// Fetch the courses data from JSONBin and display it on the teacher's page
fetch(binUrl, {
  method: 'GET',
  headers: {
    'X-Master-Key': masterKey,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log("Fetched courses:", data);  // Log the fetched data
  displayCourses(data);  // Call the function to display courses
})
.catch(error => {
  console.error('Error fetching data:', error);
});

// Function to display courses in the teacher's schedule
function displayCourses(data) {
  const courseList = document.getElementById('course-list');
  const courses = data.record.courses;

  // Clear the list before adding new items
  courseList.innerHTML = '';

  if (courses.length > 0) {
    courses.forEach(course => {
      // Create a div for each course
      const courseDiv = document.createElement('div');
      courseDiv.classList.add('course-item');
      
      // Create the course content (HTML for each course)
      const courseContent = `
        <h3>${course.courseName}</h3>
        <p><strong>Teacher:</strong> ${course.teacher}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <button onclick="deleteCourse('${course.courseId}')">Delete Course</button>
      `;
      
      // Add the content to the div
      courseDiv.innerHTML = courseContent;
      courseList.appendChild(courseDiv);
    });
  } else {
    courseList.innerHTML = '<p>No courses available.</p>';
  }
}

// Function to handle course deletion (called when the 'Delete Course' button is clicked)
function deleteCourse(courseId) {
  if (confirm('Are you sure you want to delete this course?')) {
    // Fetch the current courses data from JSONBin again
    fetch(binUrl, {
      method: 'GET',
      headers: {
        'X-Master-Key': masterKey,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const courses = data.record.courses;

      // Find the course to delete and remove it from the array
      const updatedCourses = courses.filter(course => course.courseId !== courseId);

      // Prepare the updated data object
      const updatedData = {
        ...data.record,
        courses: updatedCourses
      };

      // Send the updated data back to JSONBin
      fetch(binUrl, {
        method: 'PUT',
        headers: {
          'X-Master-Key': masterKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })
      .then(() => {
        alert('Course deleted successfully.');
        location.reload(); // Reload the page to reflect the changes
      })
      .catch(error => {
        console.error('Error deleting course:', error);
      });
    })
    .catch(error => {
      console.error('Error fetching courses:', error);
    });
  }
}

// Create a new course when the form is submitted (for the teacher page)
document.getElementById("create-course-form").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const courseName = document.getElementById("courseName").value;
  const teacherName = document.getElementById("teacherName").value;
  const courseDescription = document.getElementById("courseDescription").value;
  
  const courseData = {
    courseId: Date.now(),  // Unique ID (timestamp)
    courseName,
    teacher: teacherName,
    description: courseDescription
  };

  console.log('Creating Course:', courseData);  // Log the course data

  // Fetch existing courses from JSONBin and update
  fetch(binUrl, {
    method: 'GET',
    headers: {
      'X-Master-Key': masterKey
    }
  })
  .then(response => response.json())
  .then(data => {
    const courses = data.record.courses || [];
    courses.push(courseData); // Add the new course

    // Update JSONBin with the new course list
    return fetch(binUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': masterKey
      },
      body: JSON.stringify({ courses })
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('Course Created:', data);
    alert("Course successfully created!");
    location.reload(); // Reload the page to show the newly added course
  })
  .catch(error => {
    console.error('Error creating course:', error);
    alert("Error creating course.");
  });
});
