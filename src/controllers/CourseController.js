const Course = require('../models/courseModel.js');
const Trainer = require('../models/trainerModel.js');
const User = require('../models/user.js');


// Get a single course by ID, including instructor and user data
const getSingleCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate({
            path: 'instructor',
            populate: { path: 'user' }
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            });
        }
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const createCourse = async (req, res) => {
    try {
        const {
            title,
            category,
            instructor,
            certified,
            image,
            description,
            whatYoullLearn,
            experience,
            certificate,
            kit,
            location,
            duration,
            review,
            price
        } = req.body;

        if (!title || !instructor) {
            return res.status(400).json({
                success: false,
                message: 'Title and instructor are required.'
            });
        }

        const course = new Course({
            title,
            category,
            instructor,
            certified,
            image,
            description,
            whatYoullLearn,
            experience,
            certificate,
            kit,
            location,
            duration,
            review,
            price
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully.',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate({
            path: 'instructor',
            populate: { path: 'user' }
        });
        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });

    }
}

const contactTrainerInfo = async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id);
        const trainerProfile = await Trainer.findOne({ _id: id }).populate('user');

        if (!trainerProfile) {
            return res.status(404).json({
                success: false,
                message: 'Trainer profile not found',
            });
        }

        res.status(200).json({
            success: true,
            data: trainerProfile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};



module.exports = {
    createCourse,
    getSingleCourse,
    getAllCourses,
    contactTrainerInfo
};
