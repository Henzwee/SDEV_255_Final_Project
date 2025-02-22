document.addEventListener('DOMContentLoaded', function() {
    // Fetch the courses from JSONBin when the page loads
    fetchCourses();

    // Add course function
    const createCourseForm = document.getElementById('create-course-form');
    createCourseForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const courseName = document.getElementById('course-name').value;
        const teacherName = document.getElementById('teacher-name').value;
        const courseDescription = document.getElementById('course-description').value;

        if (!courseName || !teacherName || !courseDescription) {
            alert("All fields are required!");
            return;
        }

        const newCourse = {
            courseId: generateCourseId(),
            courseName: courseName,
            teacher: teacherName,
            description: courseDescription
        };

        // Push the new course to the JSONBin
        addCourse(newCourse);
    });

    // Fetch and display courses
    function fetchCourses() {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayCourses(data.record.courses); // Pass courses to be displayed
        })
        .catch(error => console.error('Error fetching courses:', error));
    }

    // Display courses on the page (for teacher's viewing)
    function displayCourses(courses) {
        const courseContainer = document.createElement('div');
        courseContainer.id = 'course-container';

        if (courses.length === 0) {
            courseContainer.innerHTML = "<p>No courses available.</p>";
        } else {
            courses.forEach(course => {
                const courseDiv = document.createElement('div');
                courseDiv.className = 'course';
                courseDiv.innerHTML = `
                    <p><strong>${course.courseName}</strong> (${course.teacher})</p>
                    <p>${course.description}</p>
                    <button onclick="deleteCourse('${course.courseId}')">Delete</button>
                `;
                courseContainer.appendChild(courseDiv);
            });
        }

        document.body.appendChild(courseContainer); // Add to body
    }

    // Add a new course to JSONBin
    function addCourse(course) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            data.record.courses.push(course); // Add new course
            updateCoursesData(data.record); // Send updated data to JSONBin
        })
        .catch(error => console.error('Error adding course:', error));
    }

    // Delete a course
    window.deleteCourse = function(courseId) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            data.record.courses = data.record.courses.filter(course => course.courseId !== courseId);
            updateCoursesData(data.record); // Send updated data to JSONBin
        })
        .catch(error => console.error('Error deleting course:', error));
    }

    // Update courses data in JSONBin
    function updateCoursesData(record) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ record: record })
        })
        .then(response => response.json())
        .then(updatedData => {
            console.log('Courses updated:', updatedData);
        })
        .catch(error => console.error('Error updating courses:', error));
    }

    // Generate a unique course ID (you can improve this logic as needed)
    function generateCourseId() {
        return 'course-' + Math.random().toString(36).substr(2, 9);
    }
});

