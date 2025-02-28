import React, { useState, useEffect } from "react";
import axios from "axios";
import Instance from "./Instance";
import { getUserRole } from "../utils/auth";
import { getUserData } from "../utils/auth";
import { Link } from "react-router-dom";
function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = getUserRole();
  const userData = getUserData();
  console.log(role);
  console.log(userData);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await Instance.get("/books/allbooks");
        setBooks(response.data);
        console.log(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading)
    return <h2 className="text-center text-xl font-semibold">Loading...</h2>;
  if (error)
    return (
      <h2 className="text-center text-red-500 font-semibold">Error: {error}</h2>
    );

  async function handleDelete(id) {
    try {
      await Instance.delete(`/books/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book Deleted Successfully");
      window.location.reload();
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      alert("Error deleting book");
      console.log(err);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Discover Your Next Favorite Book 📚
      </h1>

      {role === "admin" && (
        <div className="text-center mb-6">
          <Link
            to="/addbook"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            ➕ Add New Book
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-600">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={
                  book.image?.startsWith("http")
                    ? book.image
                    : `https://book-recommend-app-pcxi.onrender.com${book.image}`
                }
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-sm text-gray-600">{book.genre}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {book.description?.slice(0, 80)}...
                </p>
                <p className="mt-2 text-yellow-500 font-semibold">
                  ⭐ {book.ratings}
                </p>

                {/* Show Update & Delete buttons if Admin */}
                {role === "admin" && (
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/updatebook/${book._id}`}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
