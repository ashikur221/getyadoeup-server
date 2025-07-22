const Course = require('../models/courseModel.js');

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

module.exports = {
    createCourse
};
