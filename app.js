const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// get static html files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

//login for role
app.post('/login', (req, res) => {
    const role = req.body.role;
    if (role === 'student') {
        res.render('student', { user: req.body.username });
    } else if (role === 'teacher') {
        res.render('teacher', { user: req.body.username });
    } else {
        res.send('Invalid role');
    }
});

// routes for html pages
app.get('/add_courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_courses.html'));
});

app.get('/create_courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create_courses.html'));
});

app.get('/schedule.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});