document.addEventListener("DOMContentLoaded", function() {
  const apiUrl = "https://obsidian-sumptuous-peripheral.glitch.me/api/courses"; // API URL

  const createCourseForm = document.getElementById("create-course-form");
  if (createCourseForm) {
    console.log("🔵 Create Course Form Found");
    createCourseForm.addEventListener("submit", function(event) {
      event.preventDefault();
      console.log("🔵 Form Submitted");

      const courseName = document.getElementById("courseName").value;
      const teacherName = document.getElementById("teacherName").value;
      const creditHours = document.getElementById("creditHours").value;
      const courseDescription = document.getElementById("courseDescription").value;

      if (!creditHours) {
        alert("Please select the credit hours for this course.");
        return;
      }

      const courseData = {
        courseName,
        teacher: teacherName,
        creditHours: parseInt(creditHours, 10),
        description: courseDescription
      };

      console.log("🔵 Sending Course Data:", courseData);

      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })
      .then(response => {
        console.log("🟢 API Response Status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("🟢 API Response Data:", data);
        if (!data._id) {
          throw new Error("Course was not saved properly.");
        }
        alert("✅ Course created successfully!");
        window.location.href = "teacher.html"; // Redirect to teacher page after creation
      })
      .catch(error => {
        console.error('🔴 Error creating course:', error);
        alert("Error creating course. Check console for details.");
      });
    });
  } else {
    console.log("🔴 Create Course Form Not Found on this page");
  }

  // -------------------------
  // Teacher Page Functionality
  // -------------------------
  const courseListElement = document.getElementById('course-list');
  if (courseListElement) {
    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(courses => displayCourses(courses))
    .catch(error => console.error('🔴 Error fetching courses:', error));

    function displayCourses(courses) {
      courseListElement.innerHTML = '';
      courses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-item');
        courseDiv.innerHTML = `
          <h3>${course.courseName}</h3>
          <p><strong>Teacher:</strong> ${course.teacher}</p>
          <p><strong>Credit Hours:</strong> ${course.creditHours || 3}</p>
          <p><strong>Description:</strong> ${course.description}</p>
          <button onclick="deleteCourse('${course._id}')">❌ Delete Course</button>
        `;
        courseListElement.appendChild(courseDiv);
      });
    }

    window.deleteCourse = function(courseId) {
      if (confirm('Are you sure you want to delete this course?')) {
        fetch(`${apiUrl}/${courseId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
        .then(() => {
          alert('✅ Course deleted successfully.');
          location.reload();
        })
        .catch(error => console.error('🔴 Error deleting course:', error));
      }
    };
  }

  // -------------------------
  // Student Page: Available Courses
  // -------------------------
  const availableCourseList = document.getElementById('available-course-list');
  if (availableCourseList) {
    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(courses => displayAvailableCourses(courses))
    .catch(error => console.error('🔴 Error fetching courses:', error));
    
    function displayAvailableCourses(courses) {
      availableCourseList.innerHTML = '';
      courses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-item');
        courseDiv.innerHTML = `
          <h3>${course.courseName}</h3>
          <p><strong>Teacher:</strong> ${course.teacher}</p>
          <p><strong>Credit Hours:</strong> ${course.creditHours || 3}</p>
          <p><strong>Description:</strong> ${course.description}</p>
        `;
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = '🛒 Add to Cart';
        addToCartButton.addEventListener('click', function() {
          addToCart(course);
        });
        courseDiv.appendChild(addToCartButton);
        availableCourseList.appendChild(courseDiv);
      });
    }
  }

  // -------------------------
  // Cart Functionality
  // -------------------------
  function addToCart(course) {
    console.log("🟢 Attempting to add course to cart:", course);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.some(c => c.courseName === course.courseName)) {
      alert("⚠️ This course is already in your cart.");
      return;
    }

    cart.push(course);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Course added to cart!");
  }

  const cartCourseList = document.getElementById('cart-course-list');
  if (cartCourseList) {
    displayCart();

    function displayCart() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartCourseList.innerHTML = '';

      if (cart.length === 0) {
        cartCourseList.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      cart.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-item');
        courseDiv.innerHTML = `
          <h3>${course.courseName}</h3>
          <p><strong>Teacher:</strong> ${course.teacher}</p>
          <p><strong>Credit Hours:</strong> ${course.creditHours || 3}</p>
          <p><strong>Description:</strong> ${course.description}</p>
          <button onclick="removeFromCart(${index})">❌ Remove</button>
        `;
        cartCourseList.appendChild(courseDiv);
      });
    }
  }

  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }

  document.getElementById("finalize-schedule")?.addEventListener("click", function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let schedule = JSON.parse(localStorage.getItem("registeredCourses")) || [];

    if (cart.length === 0) {
      alert("⚠️ Your cart is empty! Add courses before finalizing.");
      return;
    }

    schedule = schedule.concat(cart);
    localStorage.setItem("registeredCourses", JSON.stringify(schedule));
    localStorage.removeItem("cart");
    alert("✅ Schedule finalized! Courses have been added.");
    window.location.href = "student.html";
  });

  // -------------------------
  // Student Page: Display Registered Courses
  // -------------------------
  const studentCourseListElement = document.getElementById('student-course-list');
  if (studentCourseListElement) {
    displayRegisteredCourses();

    function displayRegisteredCourses() {
      let registeredCourses = JSON.parse(localStorage.getItem("registeredCourses")) || [];
      studentCourseListElement.innerHTML = '';

      if (registeredCourses.length === 0) {
        studentCourseListElement.innerHTML = '<p>You have not registered for any courses.</p>';
        return;
      }

      registeredCourses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-item');
        courseDiv.innerHTML = `
          <h3>${course.courseName}</h3>
          <p><strong>Teacher:</strong> ${course.teacher}</p>
          <p><strong>Credit Hours:</strong> ${course.creditHours || 3}</p>
          <p><strong>Description:</strong> ${course.description}</p>
        `;
        studentCourseListElement.appendChild(courseDiv);
      });
    }
  }
});
