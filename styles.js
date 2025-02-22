document.addEventListener('DOMContentLoaded', function() {
    // Fetch the available courses when the page loads
    fetchAvailableCourses();

    // Fetch available courses
    function fetchAvailableCourses() {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayAvailableCourses(data.record.courses); // Pass available courses to display
        })
        .catch(error => console.error('Error fetching available courses:', error));
    }

    // Display available courses on the page
    function displayAvailableCourses(courses) {
        const courseListContainer = document.getElementById('available-course-list');
        courseListContainer.innerHTML = ''; // Clear any existing content

        if (courses.length === 0) {
            courseListContainer.innerHTML = "<p>No courses are available to add.</p>";
        } else {
            courses.forEach(course => {
                const courseDiv = document.createElement('div');
                courseDiv.className = 'course';
                courseDiv.innerHTML = `
                    <p><strong>${course.courseName}</strong> (${course.teacher})</p>
                    <p>${course.description}</p>
                    <button onclick="addCourse('${course.courseId}')">Add</button>
                `;
                courseListContainer.appendChild(courseDiv);
            });
        }
    }

    // Add course to student schedule
    window.addCourse = function(courseId) {
        fetch('https://api.jsonbin.io/v3/b/67ba173eacd3cb34a8ec8c97', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer $2a$10$KpiDLKLCc341TzIpvhpAu.nXgYzTLRPcIoJII.z3cpl9qZsD6kU/W',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const studentRecord = data.record;

            // Check if the course is already added to the schedule
            if (!studentRecord.courses.some(course => course.courseId === courseId)) {
                const courseToAdd = studentRecord.availableCourses.find(course => course.courseId === courseId);
                if (courseToAdd) {
                    studentRecord.courses.push(courseToAdd); // Add the course to the student's schedule
                    updateStudentCoursesData(studentRecord); // Send updated data to JSONBin
                }
            } else {
                alert("You are already registered for this course.");
            }
        })
        .catch(error => console.error('Error adding course:', error));
    };

    // Update student courses data in JSONBin
    function updateStudentCoursesData(record) {
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
            console.log('Student courses updated:', updatedData);
            // Optionally, display confirmation or redirect to student page
            alert("Course added successfully!");
        })
        .catch(error => console.error('Error updating student courses:', error));
    }
});
