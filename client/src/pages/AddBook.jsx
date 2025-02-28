import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "./Instance";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ratings: "",
    genre: "",
    description: "",
    image: null, // Change to file input
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("ratings", formData.ratings);
    data.append("genre", formData.genre);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await Instance.post("/books/upload", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ratings"
          placeholder="Ratings"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full p-2 border rounded"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
