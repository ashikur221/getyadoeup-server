const User = require("../models/user.js");
const { sendOtp } = require("../utils/mailer.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const signup = async (req, res) => {
    try {
        const { name, email, password, userRole, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            userRole,
            phone,
            isVerified: false,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        })

        await user.save();
        await sendOtp(email, otp);
        res.status(201).json({ message: "OTP sent to your email" });


    } catch (error) {
        res.status(500).send("Internal server error");
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // In a real app, use hashed passwords and compare with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // For now, just return a success message and user info (excluding password)

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.userRole },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ message: "Login successful", user: userData, token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error during OTP verification" });
    }
}

const getUserProfile = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: "User profile fetched successfully", user: userData });
}


const updateUserProfile = async (req, res) => {

    console.log(req.body);
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // console.log(user);

        // Only allow certain fields to be updated
        const allowedUpdates = ['name', 'email', 'phone'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // Yes, this is correct. You should use user.save() here to persist the changes made to the user document instance.
        await user.save();

        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ message: "Profile updated successfully", user: userData });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating profile" });
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required" });
        }

        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare old password
        // If you use bcrypt, replace this with bcrypt.compare
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Optionally, you can add password strength validation here

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error changing password" });
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Here you would send the OTP to the user's email.
        await sendOtp(email, otp);

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing forget password" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.otp || !user.otpExpiry || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error resetting password" });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.deleteOne({ _id: userId });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting account" });
    }
};

const deleteAllAccounts = async (req, res) => {
    try {
        // // Only allow admin to delete all accounts
        // if (!req.user || req.user.role !== "admin") {
        //     return res.status(403).json({ message: "Unauthorized" });
        // }

        await User.deleteMany({});

        res.status(200).json({ message: "All accounts deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting all accounts" });
    }
};





module.exports = {
    signup,
    login,
    verifyOtp,
    getUserProfile,
    updateUserProfile,
    changePassword,
    forgetPassword,
    resetPassword,
    deleteAccount,
    deleteAllAccounts
}