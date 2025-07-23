const User = require("../models/user.js");
const Course = require("../models/courseModel.js");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude password field
        res.status(200).json({ message: "All users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Course by Admin 
const deleteCourseByAdmin = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

module.exports = {
    getAllUsers,
    deleteCourseByAdmin
};
