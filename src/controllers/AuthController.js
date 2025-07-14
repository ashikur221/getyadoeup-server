const User = require("../models/user.js");

const signup = async (req, res) => {
    try {
        const { name, email, password, userRole, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).send("Email already registered");
        }

        const user = new User({
            name,
            email,
            password,
            userRole,
            phone
        })

        await user.save();
        res.status(201).send("User created successfully");


    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    signup
}