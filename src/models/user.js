const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    userRole: {
        type: String,
        enum: ['admin', 'student', 'trainer'], // add or adjust roles as needed
        required: true
    },
    phone: String
})

module.exports = mongoose.model('User', userSchema);