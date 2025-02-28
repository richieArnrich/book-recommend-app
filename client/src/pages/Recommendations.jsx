import React, { useEffect, useState } from "react"; // Reusable axios instance
import { useNavigate } from "react-router-dom";
import Instance from "./Instance";
import { getUserData } from "../utils/auth";
const userData = getUserData();
const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token
        if (!token) {
          navigate("/login"); // Redirect to login if not authenticated
          return;
        }
        const response = await Instance.get("/books/recommended", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data.recommendedBooks); // Store books in state
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-600">
          {userData.name}, No recommendations found.
        </p>
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
                    : `https://book-recommend-app-api.vercel.app${book.image}`
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
                  {book.description
                    ? book.description.slice(0, 80) + "..."
                    : "No description available."}
                </p>
                <p className="mt-2 text-yellow-500 font-semibold">
                  ⭐ {book.ratings}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
