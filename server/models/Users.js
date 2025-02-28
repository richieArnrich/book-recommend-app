const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Default role is 'user',
  preferences: {
    genres: { type: [String], default: [] },
    authors: { type: [String], default: [] },
  },
});

module.exports = mongoose.model("User", userSchema);
