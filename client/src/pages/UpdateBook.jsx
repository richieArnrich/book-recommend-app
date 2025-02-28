import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instance from "./Instance";

const UpdateBook = () => {
  const { id } = useParams(); // Get book ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ratings: "",
    genre: "",
    description: "",
    image: null,
  });

  // Fetch book details when the component loads
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await Instance.get(`books/single/${id}`);
        const book = response.data.book;
        console.log(response);
        setFormData({
          title: book.title,
          author: book.author,
          ratings: book.ratings,
          genre: book.genre,
          description: book.description,
          image: null, // Image will be updated only if changed
        });
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBook();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Handle form submission
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
      await Instance.put(`/books/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Book updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Update Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Book Title"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          placeholder="Author"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ratings"
          value={formData.ratings}
          placeholder="Ratings (1-5)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          placeholder="Genre"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={formData.description}
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
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
