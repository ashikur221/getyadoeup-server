const User = require('../models/user.js')

const getAllTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ userRole: 'trainer' });
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

module.exports = {
    getAllTrainers,
};

