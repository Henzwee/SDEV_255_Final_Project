document.addEventListener("DOMContentLoaded", function() {
  const apiUrl = "http://localhost:3000/api/courses"; // JSONBin URL,,, updated to url
  //const masterKey = "$2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W"; // Master key

  // -------------------------
  // Teacher Page Functionality
  // -------------------------
  const courseListElement = document.getElementById('course-list');
  if (courseListElement) {
    // Fetch and display courses for the teacher page
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        //'X-Master-Key': masterKey,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(courses => {
      displayCourses(courses);
    })
    .catch(error => {
      console.error('Error fetching courses:', error);
    });

    // Function to display courses on the teacher page
    function displayCourses(courses) {
      courseListElement.innerHTML = '';
      if (courses.length > 0) {
        courses.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.classList.add('course-item');
          courseDiv.innerHTML = `
            <h3>${course.courseName}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <button onclick="deleteCourse('${course.courseId}')">Delete Course</button>
          `;
          courseListElement.appendChild(courseDiv);
        });
      } else {
        courseListElement.innerHTML = '<p>No courses available.</p>';
      }
    }

    // Global deletion function for teacher page (accessible via inline onclick)
    window.deleteCourse = function(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
        fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
          headers: {
            //'X-Master-Key': masterKey,
            'Content-Type': 'application/json'
          }
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

    // Course creation form handling on teacher page
    const createCourseForm = document.getElementById("create-course-form");
    if (createCourseForm) {
      createCourseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const courseName = document.getElementById("courseName").value;
        const teacherName = document.getElementById("teacherName").value;
        const courseDescription = document.getElementById("courseDescription").value;
        
        const courseData = { courseName, teacher: teacherName, description: courseDescription };

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
          alert("Course created successfully!");
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
  // Student Page: Available Courses for Registration
  // -------------------------
  const availableCourseList = document.getElementById('available-course-list');
  if (availableCourseList) {
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        //'X-Master-Key': masterKey,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(courses => {
      displayAvailableCourses(courses);
    })
    .catch(error => {
      console.error('Error fetching courses:', error);
    });
    
    // Function to display available courses with a "Register" button
    function displayAvailableCourses(courses) {
      availableCourseList.innerHTML = '';
      if (courses.length > 0) {
        courses.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.classList.add('course-item');
          courseDiv.innerHTML = `
            <h3>${course.courseName}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Description:</strong> ${course.description}</p>
          `;
          const registerButton = document.createElement('button');
          registerButton.textContent = 'Register';
          registerButton.addEventListener('click', function() {
            registerCourse(course);
          });
          courseDiv.appendChild(registerButton);
          availableCourseList.appendChild(courseDiv);
        });
      } else {
        availableCourseList.innerHTML = '<p>No available courses.</p>';
      }
    }

    // Function to register a course by saving it to localStorage
    function registerCourse(course) {
      let registeredCourses = [];
      const registeredCoursesJSON = localStorage.getItem("registeredCourses");
      if (registeredCoursesJSON) {
        try {
          registeredCourses = JSON.parse(registeredCoursesJSON);
        } catch (e) {
          console.error("Error parsing registered courses from localStorage", e);
        }
      }
      // Prevent duplicate registrations
      if (registeredCourses.find(c => c.courseId === course.courseId)) {
        alert("You are already registered for this course.");
        return;
      }
      registeredCourses.push(course);
      localStorage.setItem("registeredCourses", JSON.stringify(registeredCourses));
      alert("Course registered successfully!");
    }
  }

  // -------------------------
  // Student Page: Display Registered Courses (with Remove functionality)
  // -------------------------
  const studentCourseListElement = document.getElementById('student-course-list');
  if (studentCourseListElement) {
    displayRegisteredCourses();

    function displayRegisteredCourses() {
      let registeredCourses = [];
      const registeredCoursesJSON = localStorage.getItem("registeredCourses");
      if (registeredCoursesJSON) {
        try {
          registeredCourses = JSON.parse(registeredCoursesJSON);
        } catch (e) {
          console.error("Error parsing registered courses from localStorage", e);
        }
      }
      studentCourseListElement.innerHTML = '';
      if (registeredCourses.length > 0) {
        registeredCourses.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.classList.add('course-item');
          courseDiv.innerHTML = `
            <h3>${course.courseName}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Description:</strong> ${course.description}</p>
          `;
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', function() {
            removeRegisteredCourse(course.courseId);
          });
          courseDiv.appendChild(removeButton);
          studentCourseListElement.appendChild(courseDiv);
        });
      } else {
        studentCourseListElement.innerHTML = '<p>You have not registered for any courses.</p>';
      }
    }

    // Function to remove a registered course from localStorage and update the display
    function removeRegisteredCourse(courseId) {
      let registeredCourses = [];
      const registeredCoursesJSON = localStorage.getItem("registeredCourses");
      if (registeredCoursesJSON) {
        try {
          registeredCourses = JSON.parse(registeredCoursesJSON);
        } catch(e) {
          console.error("Error parsing registered courses from localStorage", e);
        }
      }
      const updatedCourses = registeredCourses.filter(course => course.courseId !== courseId);
      localStorage.setItem("registeredCourses", JSON.stringify(updatedCourses));
      displayRegisteredCourses();
      alert("Course removed from your schedule.");
    }
  }
});
