const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, { timestamps: true });

bookmarkSchema.index({ user: 1, course: 1 }, { unique: true }); // Prevent duplicate bookmarks

module.exports = mongoose.model('Bookmark', bookmarkSchema);
