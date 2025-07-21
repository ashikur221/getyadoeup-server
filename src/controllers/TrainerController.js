const Trainer = require('../models/trainerModel.js');
const mongoose = require('mongoose');



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

module.exports = {
    updateTrainerProfile,
    getTrainerInfo,
}; 