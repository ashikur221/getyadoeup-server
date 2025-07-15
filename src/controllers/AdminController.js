const User = require("../models/user.js");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude password field
        res.status(200).json({ message: "All users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {  
    getAllUsers
};
