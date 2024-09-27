const User = require("../models/user.model");
const { hashSync, compareSync } = require("bcrypt");

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

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
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });

    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

 

const updateProfile = async (req, res) => { 
    console.log("Update profile request received"); // Log when request is received
    console.log(req.body); // Check the request body
  
    const { fullname, email, address, gender } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if email is being changed and if it's already taken
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ error: "Email is already in use." });
        }
      }
  
      user.fullname = fullname;
      user.email = email;
      user.address = address;
      user.gender = gender;
  
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error); // Log errors for debugging
      res.status(500).json({ error: "Failed to update profile" });
    }
  };
  
  

module.exports = { signup, login ,updateProfile}