const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require("./Database/db.js");
const User = require("./Database/User"); // Import the User model
const courseRoutes = require("./Database/courseRoutes");
const cors = require('cors');
const session = require('express-session');

app.use('/api', courseRoutes);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'docs')));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if you are using HTTPS
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Updated /login route with role authentication
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body; // Include role in the request body
    try {
        const user = await User.findOne({ username: username, role: role }); // Query with username and role
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

app.get('/add_courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'add_courses.html'));
});

app.get('/create_courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'create_courses.html'));
});

app.get('/schedule.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'schedule.html'));
});