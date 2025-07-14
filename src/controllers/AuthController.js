const User = require("../models/user.js");
const { sendOtp } = require("../utils/mailer.js");


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const signup = async (req, res) => {
    try {
        const { name, email, password, userRole, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        const otp = generateOtp();

        const user = new User({
            name,
            email,
            password,
            userRole,
            phone,
            isVerified: false,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        })

        await user.save();
        await sendOtp(email, otp);
        res.status(201).send("User created successfully");


    } catch (error) {
        res.status(500).send("Internal server error");
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        // In a real app, use hashed passwords and compare with bcrypt
        if (user.password !== password) {
            return res.status(400).send("Invalid  password");
        }

        // For now, just return a success message and user info (excluding password)
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ message: "Login successful", user: userData });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        if (user.isVerified) {
            return res.send("User already verified");
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).send("Invalid OTP");
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).send("OTP verified successfully");

    } catch (error) {
        res.status(500).send("Server error during OTP verification");
    }
}



module.exports = {
    signup,
    login,
    verifyOtp
}