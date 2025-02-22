document.addEventListener('DOMContentLoaded', function() {
    const courseListContainer = document.getElementById('course-list');

    // Fetch courses when the page loads
    fetchCourses();

    // Handle form submission to create a new course
    const createCourseForm = document.getElementById('create-course-form');
    createCourseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const courseName = document.getElementById('courseName').value;
        const teacherName = document.getElementById('teacherName').value;
        const courseDescription = document.getElementById('courseDescription').value;

        const newCourse = {
            courseId: Date.now().toString(), // Unique ID based on timestamp
            courseName: courseName,
            teacher: teacherName,
            description: courseDescription
        };

        addCourseToJSONBin(newCourse);
    });

    // Fetch courses from JSONBin
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
            const courses = data.record.courses || [];
            displayCourses(courses);
        })
        .catch(error => console.error('Error fetching courses:', error));
    }

    // Display courses on the page
    function displayCourses(courses) {
        courseListContainer.innerHTML = ''; // Clear existing courses
        if (courses.length === 0) {
            courseListContainer.innerHTML = "<p>No courses available.</p>";
        } else {
            courses.forEach(course => {
                const courseDiv = document.createElement('div');
                courseDiv.className = 'course';
                courseDiv.innerHTML = `
                    <p><strong>${course.courseName}</strong> by ${course.teacher}</p>
                    <p>${course.description}</p>
                    <button onclick="deleteCourse('${course.courseId}')">Delete</button>
                `;
                courseListContainer.appendChild(courseDiv);
            });
        }
    }

    // Add a new course to the JSONBin
    function addCourseToJSONBin(course) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const teacherRecord = data.record;

            // Add the new course to the list of courses
            teacherRecord.courses.push(course);

            // Send updated data back to JSONBin
            updateCoursesInJSONBin(teacherRecord);
        })
        .catch(error => console.error('Error adding course:', error));
    }

    // Update the courses in JSONBin after adding
    function updateCoursesInJSONBin(updatedRecord) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ record: updatedRecord })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Courses updated successfully:', data);
            fetchCourses(); // Refresh the list of courses
        })
        .catch(error => console.error('Error updating courses:', error));
    }

    // Delete a course (confirmation alert)
    window.deleteCourse = function(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                const teacherRecord = data.record;
                const courses = teacherRecord.courses.filter(course => course.courseId !== courseId);
                teacherRecord.courses = courses;
                updateCoursesInJSONBin(teacherRecord); // Update the course list
            })
            .catch(error => console.error('Error deleting course:', error));
        }
    };
});
