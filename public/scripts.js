document.addEventListener("DOMContentLoaded", function() {
  const binUrl = "https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97"; // JSONBin URL
  const masterKey = "$2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W"; // Master key

  // -------------------------
  // Teacher Page Functionality
  // -------------------------
  const courseListElement = document.getElementById('course-list');
  if (courseListElement) {
    // Fetch and display courses for the teacher page
    fetch(binUrl, {
      method: 'GET',
      headers: {
        'X-Master-Key': masterKey,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched courses for teacher:", data);
      if (data.record && Array.isArray(data.record.courses)) {
        displayCourses(data);
      } else {
        console.error('No courses data available.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    // Function to display courses in the teacher's page
    function displayCourses(data) {
      const courses = data.record.courses || [];
      courseListElement.innerHTML = '';
      if (courses.length > 0) {
        courses.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.classList.add('course-item');
          const courseContent = `
            <h3>${course.courseName}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <button onclick="deleteCourse('${course.courseId}')">Delete Course</button>
          `;
          courseDiv.innerHTML = courseContent;
          courseListElement.appendChild(courseDiv);
        });
      } else {
        courseListElement.innerHTML = '<p>No courses available.</p>';
      }
    }

    // Expose deleteCourse globally so inline onclick can access it
    window.deleteCourse = function(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
        // Fetch current courses data
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
          const updatedCourses = courses.filter(course => course.courseId !== courseId);
          const updatedData = {
            ...data.record,
            courses: updatedCourses
          };
          // Update JSONBin with the new courses list
          return fetch(binUrl, {
            method: 'PUT',
            headers: {
              'X-Master-Key': masterKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
          });
        })
        .then(() => {
          alert('Course deleted successfully.');
          location.reload();
        })
        .catch(error => {
          console.error('Error deleting course:', error);
        });
      }
    };

    // If the course creation form exists, attach the submit event handler
    const createCourseForm = document.getElementById("create-course-form");
    if (createCourseForm) {
      createCourseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const courseName = document.getElementById("courseName").value;
        const teacherName = document.getElementById("teacherName").value;
        const courseDescription = document.getElementById("courseDescription").value;
        
        const courseData = {
          courseId: Date.now(),  // Unique ID based on timestamp
          courseName,
          teacher: teacherName,
          description: courseDescription
        };

        console.log('Creating Course:', courseData);
        // Get current courses
        fetch(binUrl, {
          method: 'GET',
          headers: {
            'X-Master-Key': masterKey
          }
        })
        .then(response => response.json())
        .then(data => {
          const courses = data.record.courses || [];
          courses.push(courseData);
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
          alert("Course successfully created!");
          console.log('Course Created:', data);
          location.reload();
        })
        .catch(error => {
          console.error('Error creating course:', error);
          alert("Error creating course.");
        });
      });
    }
  }

  // -------------------------
  // Student Page Functionality
  // -------------------------
  const availableCourseList = document.getElementById('available-course-list');
  if (availableCourseList) {
    // Fetch and display courses for the student page
    fetch(binUrl, {
      method: 'GET',
      headers: {
        'X-Master-Key': masterKey,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched courses for students:", data);
      if (data.record && Array.isArray(data.record.courses)) {
        displayAvailableCourses(data.record.courses);
      } else {
        console.error('No courses available.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    // Function to display courses for the student page
    function displayAvailableCourses(courses) {
      availableCourseList.innerHTML = '';
      if (courses.length > 0) {
        courses.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.classList.add('course-item');
          const courseContent = `
            <h3>${course.courseName}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <button onclick="registerCourse('${course.courseId}')">Register</button>
          `;
          courseDiv.innerHTML = courseContent;
          availableCourseList.appendChild(courseDiv);
        });
      } else {
        availableCourseList.innerHTML = '<p>No available courses.</p>';
      }
    }

    // Expose registerCourse globally so inline onclick can access it
    window.registerCourse = function(courseId) {
      alert(`You have registered for course ID: ${courseId}`);
      // Implement further registration functionality as needed
    };
  }
});
