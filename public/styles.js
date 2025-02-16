    // Show/hide links based on the user role
    if (userRole === "student") {
      document.getElementById("add-courses-link").style.display = "block";
    } else if (userRole === "teacher") {
      document.getElementById("create-courses-link").style.display = "block";
    }
