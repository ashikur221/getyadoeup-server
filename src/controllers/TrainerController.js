const Trainer = require('../models/trainerModel.js');
const mongoose = require('mongoose');
const User = require('../models/user.js');


const updateTrainerProfile = async (req, res) => {
    try {
        const {
            specializations,
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
                linkedinUrl
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

module.exports = {
    updateTrainerProfile,
    getTrainerInfo,
    getAllTrainers,
    setTrainerFeatured,
    getFeaturedTrainers,
}; 