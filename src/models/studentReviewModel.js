const mongoose = require('mongoose');

const studentReviewSchema = new mongoose.Schema({
    reviewLink_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReviewLink',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: false,
        maxlength: 1000
    },
    photo: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentReview', studentReviewSchema);
