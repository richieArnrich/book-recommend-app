const express = require("express");
const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "mySeckretkey";
//  Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, preferences, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password manually in the route
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role (default: user)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // Only allow 'admin' if explicitly provided
      preferences: preferences || { genres: [], authors: [] },
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 User Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // Sending token in response too (optional)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
