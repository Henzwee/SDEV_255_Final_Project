// mongo sign in to database info
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://User:password0123@finalproject.0i4uh.mongodb.net/?retryWrites=true&w=majority&appName=FinalProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
