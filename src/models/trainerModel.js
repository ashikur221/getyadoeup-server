const mongoose = require('mongoose')

const trainerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specializations: {
        type: [String],
    },
    certifications: {
        type: [String],
    },
    about: {
        type: String,
    },
    profilePhoto: {
        type: String, // URL to the photo
    },
    facebookUrl: {
        type: String,
    },
    twitterUrl: {
        type: String,
    },
    instagramUrl: {
        type: String,
    },
    linkedinUrl: {
        type: String,
    }
}, { timestamps: true });


module.exports = mongoose.model('Trainer', trainerSchema);