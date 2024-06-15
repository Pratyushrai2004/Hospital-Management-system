const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register route
router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (userExists) {
      return res
        .status(200)
        .send({
          message: "User already exists please try to login",
          success: false,
        });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating user", success: false });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find the user by email or phone
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    // Compare passwords using bcrypt compare here i called req.body.password which is not hasshed and user.password is hasshed i called it from the backend
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Incorrect password", success: false });
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {       // Generate JWT token
      expiresIn: "3d",
    });

    // Return success response with token
    res.status(200).send({ message: "Login successful", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
});
// Get user info by ID route
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: "user does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error getting user info", success: false, error });
  }
});

module.exports = router;
