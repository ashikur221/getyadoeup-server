require('dotenv').config(); 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

exports.sendOtp = async (to, otp) => {
    
    try {
        await transporter.sendMail({
            from: `"getyadoeup" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        });
    } catch (err) {
        console.error('Error sending OTP email:', err);
        throw err;
    }
};