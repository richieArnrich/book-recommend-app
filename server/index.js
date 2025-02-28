require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://arnoldrichie31rar:richie123@cluster0.rh7xzxd.mongodb.net/bookdb"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
