const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const mongoose = require("./Database/db.js");
const User = require("./Database/User"); // Import the User model
const courseRoutes = require("./Database/courseRoutes");

const app = express();

// ✅ FIX: Move `express.json()` & `express.urlencoded()` BEFORE your routes
app.use(cors());
app.use(express.json());  // ✅ Fixes "req.body undefined" issue
app.use(express.urlencoded({ extended: true })); // ✅ Parses form data

// ✅ Ensure API routes come AFTER middleware
app.use('/api', courseRoutes);

// ✅ Serve static files (docs directory)
app.use(express.static(path.join(__dirname, 'docs')));

// ✅ Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Debugging Route: Check if req.body is received
app.post('/api/debug', (req, res) => {
    console.log("🟢 Received Body:", req.body);
    res.json({ message: "✅ Debugging Success!", receivedData: req.body });
});

// ✅ Login Route (No Changes Here)
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await User.findOne({ username: username, role: role });
        if (user) {
            user.verifyPassword(password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }
                if (isMatch) {
                    req.session.userId = user._id;
                    req.session.role = user.role;
                    res.json({ success: true, url: `/${user.role.toLowerCase()}.html` });
                } else {
                    res.json({ success: false, message: 'Invalid credentials or role' });
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials or role' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Course Creation Route
app.post('/api/courses', async (req, res) => {
    try {
        console.log("🔵 Request Payload:", req.body); // Log the request payload
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        console.log("🟢 Course saved:", savedCourse); // Log the saved course
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error("🔴 Error saving course:", err);
        res.status(400).json({ message: err.message });
    }
});

// ✅ Serve HTML pages
app.get('/add_courses.html', (req, res) => res.sendFile(path.join(__dirname, 'docs', 'add_courses.html')));
app.get('/create_courses.html', (req, res) => res.sendFile(path.join(__dirname, 'docs', 'create_courses.html')));
app.get('/schedule.html', (req, res) => res.sendFile(path.join(__dirname, 'docs', 'schedule.html')));
