// Update a course by the currently authenticated trainer

const Trainer = require('../models/trainerModel.js');
const Course = require('../models/courseModel.js');
const mongoose = require('mongoose');
const User = require('../models/user.js');

// auth related function 

const updateTrainerProfile = async (req, res) => {
    try {
        const {
            specializations,
            previousWorks,
            certifications,
            about,
            profilePhoto,
            facebookUrl,
            twitterUrl,
            instagramUrl,
            linkedinUrl
        } = req.body;

        const userId = req.user.id;

        let trainerProfile = await Trainer.findOne({ user: userId });

        if (trainerProfile) {
            // Update existing profile
            trainerProfile.specializations = specializations || trainerProfile.specializations;
            trainerProfile.certifications = certifications || trainerProfile.certifications;
            trainerProfile.about = about || trainerProfile.about;
            trainerProfile.profilePhoto = profilePhoto || trainerProfile.profilePhoto;
            trainerProfile.facebookUrl = facebookUrl || trainerProfile.facebookUrl;
            trainerProfile.twitterUrl = twitterUrl || trainerProfile.twitterUrl;
            trainerProfile.instagramUrl = instagramUrl || trainerProfile.instagramUrl;
            trainerProfile.linkedinUrl = linkedinUrl || trainerProfile.linkedinUrl;
            trainerProfile.previousWorks = previousWorks || trainerProfile.previousWorks;
        } else {
            // Create new profile
            trainerProfile = new Trainer({
                user: userId,
                specializations,
                certifications,
                about,
                profilePhoto,
                facebookUrl,
                twitterUrl,
                instagramUrl,
                linkedinUrl,
                previousWorks
            });
        }

        await trainerProfile.save();

        res.status(200).json({
            success: true,
            message: 'Trainer profile updated successfully',
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

const getTrainerInfo = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const trainerProfile = await Trainer.findOne({ user: userId });

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

const getAllTrainers = async (req, res) => {
    try {
        // Find all users with userRole 'trainer'
        const users = await User.find({ userRole: 'trainer' });
        // For each user, try to find their trainer profile
        const trainers = await Promise.all(users.map(async (user) => {
            const trainerProfile = await Trainer.findOne({ user: user._id });
            return {
                user,
                trainerProfile
            };
        }));
        res.status(200).json({
            success: true,
            data: trainers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

const setTrainerFeatured = async (req, res) => {
    try {
        const { trainerId, featured } = req.body;
        if (typeof featured !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'The featured value must be boolean.'
            });
        }
        const trainer = await Trainer.findByIdAndUpdate(
            trainerId,
            { featured },
            { new: true }
        );
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not filled up all the information.'
            });
        }
        res.status(200).json({
            success: true,
            message: `Trainer has been ${featured ? 'set as' : 'unset from'} featured`,
            data: trainer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

const getFeaturedTrainers = async (req, res) => {
    try {
        const featuredTrainers = await Trainer.find({ featured: true }).populate('user');
        res.status(200).json({
            success: true,
            data: featuredTrainers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};



const deleteTrainer = async (req, res) => {
    try {
        const { userId } = req.params; //userId of the trainer
        // console.log(userId)

        // Find the user by ID and ensure they are a trainer 
        const user = await User.findById(userId);
        // console.log(user)

        if (!user || user.userRole !== 'trainer') {
            return res.status(404).json({
                success: false,
                message: 'Trainer user not found.'
            });
        }

        // Delete the Trainer profile if it exists 
        await Trainer.findOneAndDelete({ user: userId });

        // Delete the user 
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Trainer user and profile (if existed) deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        })
    }
};

// course related function 

// Get all courses of the currently authenticated instructor (trainer)
const getCoursesByTrainer = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find the trainer profile for the authenticated user
        const trainerProfile = await Trainer.findOne({ user: userId });
        if (!trainerProfile) {
            return res.status(404).json({
                success: false,
                message: 'Trainer profile not found',
            });
        }
        // Find all courses where the instructor is this trainer
        const courses = await Course.find({ instructor: trainerProfile._id }).populate({
            path: 'instructor',
            populate: { path: 'user' }
        })
        res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};



// Delete a course by the currently authenticated trainer
const deleteCourseByTrainer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        // Find the trainer profile for the authenticated user
        const trainerProfile = await Trainer.findOne({ user: userId });
        if (!trainerProfile) {
            return res.status(404).json({
                success: false,
                message: 'Trainer profile not found',
            });
        }
        // Find the course and ensure it belongs to this trainer
        const course = await Course.findOne({ _id: courseId, instructor: trainerProfile._id });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or you do not have permission to delete this course',
            });
        }
        await Course.deleteOne({ _id: courseId });
        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};


const updateCourseByTrainer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const updateData = req.body;
        // Find the trainer profile for the authenticated user
        const trainerProfile = await Trainer.findOne({ user: userId });
        if (!trainerProfile) {
            return res.status(404).json({
                success: false,
                message: 'Trainer profile not found',
            });
        }
        // Find the course and ensure it belongs to this trainer
        const course = await Course.findOne({ _id: courseId, instructor: trainerProfile._id });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or you do not have permission to update this course',
            });
        }
        // Update the course with the provided data
        Object.assign(course, updateData);
        await course.save();
        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
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
    updateTrainerProfile,
    getTrainerInfo,
    getAllTrainers,
    setTrainerFeatured,
    getFeaturedTrainers,
    deleteTrainer,
    getCoursesByTrainer,
    deleteCourseByTrainer,
    updateCourseByTrainer
}; 