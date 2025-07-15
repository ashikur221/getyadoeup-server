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



module.exports = {
    signup,
    login,
    verifyOtp,
    getUserProfile
}