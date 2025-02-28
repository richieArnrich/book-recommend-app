const jwt = require("jsonwebtoken");
const User = require("../models/Users");

//  Middleware to verify authentication
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

//  Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied, only admins can perform this action" });
  }
};

module.exports = { protect, adminOnly };
