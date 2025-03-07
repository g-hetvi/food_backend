const User = require("../models/user.model");
const { hashSync, compareSync } = require("bcrypt");

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: "User already exists",
                data: {}
            });
        }
        const hashPassword = hashSync(password, 10);

        // Create a new user
        const val = await User.create({
            fullname: fullname,
            email: email,
            password: hashPassword
        });

        // Respond with success
        return res.status(200).send({ status: true, code: 200, message: "User created successfully", data: [val] });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).send({
            status: false,
            code: 500,
            message: "Internal server error",
            error: error.message,
            data: {}
        });
    }
};
  
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If the user doesn't exist
        if (!user) {
            return res.status(400).json({
                message: "Invalid username or password"
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = compareSync(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid username or password"
            });
        }

        // If the login is successful
        res.status(200).json({
            status: true,
            message: "Login successful",
            data: { _id: user._id, fullname: user.fullname, email: user.email },
        });

    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { signup,login}