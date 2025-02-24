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

    // Function to display courses on the teacher page
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

    // Global deletion function for teacher page (used by inline onclick)
    window.deleteCourse = function(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
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

    // Course creation form handling on teacher page
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
  // Student Page - Available Courses (Registration)
  // -------------------------
  const availableCourseList = document.getElementById('available-course-list');
  if (availableCourseList) {
    // Fetch and display courses for registration
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
        } catch(e) {
          console.error("Error parsing registered courses from localStorage", e);
        }
      }
      // Prevent duplicate registrations
      if (registeredCourses.find(c => c.courseId === course.courseId)) {
        alert("You have already registered for this course.");
        return;
      }
      registeredCourses.push(course);
      localStorage.setItem("registeredCourses", JSON.stringify(registeredCourses));
      alert("Course registered successfully!");
    }
  }

  // -------------------------
  // Student Page - Registered Courses
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
        } catch(e) {
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
          studentCourseListElement.appendChild(courseDiv);
        });
      } else {
        studentCourseListElement.innerHTML = '<p>You have not registered for any courses.</p>';
      }
    }
  }
});
