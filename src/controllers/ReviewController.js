const crypto = require('crypto');
const ReviewLink = require('../models/reviewLinkModel.js');
const Course = require('../models/courseModel.js');
const Trainer = require('../models/trainerModel.js')
const StudentReview = require('../models/studentReviewModel.js')

// Generate a unique review link for a course
const generateReviewLink = async (req, res) => {
    try {
        const { courseId, startDate, endDate } = req.body;
        const userId = req.user.id; // Assuming trainer is authenticated

        const trainer = await Trainer.findOne({
            user: userId
        });


        // Validate input
        if (!courseId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Course ID, start date, and end date are required.'
            });
        }

        // Check if the course belongs to the trainer
        const course = await Course.findOne({
            _id: courseId,
            instructor: trainer?._id
        });

        // console.log(course);

        if (!course) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to generate links for this course or course does not exist.'
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        // if (start < now) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Start date cannot be in the past.'
        //     });
        // }

        // if (end <= start) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'End date must be after start date.'
        //     });
        // }

        // Generate unique token
        const token = crypto.randomBytes(20).toString('hex');

        // Create review link document
        const reviewLink = new ReviewLink({
            token,
            course: courseId,
            trainer: trainer?._id,
            startDate: start,
            endDate: end,
            isActive: true
        });

        await reviewLink.save();

        // Construct the full URL
        const baseUrl = process.env.BASE_URL || 'https://yourdomain.com';
        const reviewUrl = `${baseUrl}/review/${token}`;

        res.status(201).json({
            success: true,
            message: 'Review link generated successfully.',
            data: {
                token,
                link: reviewUrl,
                expiresAt: end
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Verify a review link token
const verifyReviewLink = async (req, res) => {
    try {
        const { token } = req.params;

        const reviewLink = await ReviewLink.findOne({ token })
            .populate('course')
            .populate('trainer');

        if (!reviewLink) {
            return res.status(404).json({
                success: false,
                message: 'Invalid review link.'
            });
        }

        // const now = new Date();
        // if (now < reviewLink.startDate) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'This review link is not yet active.'
        //     });
        // }

        // if (now > reviewLink.endDate) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'This review link has expired.'
        //     });
        // }

        // if (!reviewLink.isActive) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'This review link has been deactivated.'
        //     });
        // }

        res.status(200).json({
            success: true,
            data: {
                course: reviewLink.course,
                validUntil: reviewLink.endDate
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const submitReview = async (req, res) => {
    try {

        const { student_id, rating, review, photo, token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Review link token is missing." });
        }

        // Find review link by token
        const reviewLink = await ReviewLink.findOne({ token });

        if (!reviewLink) {
            return res.status(404).json({ success: false, message: "Invalid or expired review link." });
        }

        // Optional: Prevent multiple reviews from same token
        const alreadyReviewed = await StudentReview.findOne({ reviewLink_id: reviewLink._id });
        if (alreadyReviewed) {
            return res.status(409).json({ success: false, message: "Review already submitted for this link." });
        }

        // Validate required fields
        if (!student_id || !rating) {
            return res.status(400).json({ success: false, message: "Student name and rating are required." });
        }

        const payload = {
            reviewLink_id: reviewLink._id,
            course_id: reviewLink.course,
            trainer_id: reviewLink.trainer,
            student_id,
            rating,
            review,
            photo
        }

        // Create review
        const newReview = await StudentReview.create({
            reviewLink_id: reviewLink._id,
            course_id: reviewLink.course,
            trainer_id: reviewLink.trainer,
            student_id,
            rating,
            review,
            photo
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: newReview
        });
    } catch (error) {
        console.error("Submit review error:", error);
        return res.status(500).json({ success: false, message: "Server error while submitting review." });
    }
};



module.exports = {
    generateReviewLink,
    verifyReviewLink,
    submitReview
}