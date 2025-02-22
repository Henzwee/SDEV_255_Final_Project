document.addEventListener("DOMContentLoaded", function() {
  // Attach the event listener to the form only after the DOM is fully loaded
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
      alert("Course successfully created!");
      console.log('Course Created:', data);
      location.reload(); // Reload the page to show the newly added course
    })
    .catch(error => {
      console.error('Error creating course:', error);
      alert("Error creating course.");
    });
  });
});
