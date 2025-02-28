import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "./Instance";

const genresList = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "History",
  "Thriller",
];
const authorsList = [
  "J.R.R. Tolkien",
  "Agatha Christie",
  "George R.R. Martin",
  "J.K. Rowling",
];

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    preferences: {
      genres: [],
      authors: [],
    },
  });

  const navigate = useNavigate();

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedPreferences = checked
        ? [...prevState.preferences[type], value]
        : prevState.preferences[type].filter((item) => item !== value);

      return {
        ...prevState,
        preferences: { ...prevState.preferences, [type]: updatedPreferences },
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Instance.post("/users/register", formData);
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account ✌️
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Genre Preferences - Checkboxes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Favorite Genres
            </label>
            <div className="grid grid-cols-2 gap-2">
              {genresList.map((genre) => (
                <label key={genre} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.preferences.genres.includes(genre)}
                    onChange={(e) => handleCheckboxChange(e, "genres")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Author Preferences - Checkboxes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Favorite Authors
            </label>
            <div className="grid grid-cols-2 gap-2">
              {authorsList.map((author) => (
                <label key={author} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={author}
                    checked={formData.preferences.authors.includes(author)}
                    onChange={(e) => handleCheckboxChange(e, "authors")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{author}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
