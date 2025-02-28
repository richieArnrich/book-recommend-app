const express = require("express");
const multer = require("multer");
const path = require("path");
const Book = require("../models/Book"); // Import the model
const mongoose = require("mongoose");
const axios = require("axios");
const { protect, adminOnly } = require("../middlewares/authMiddleware.js");
const User = require("../models/Users");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Route to handle book uploads
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, author, genre, ratings } = req.body;

      if (!title || !author || !genre) {
        return res
          .status(400)
          .json({ message: "Title, author, and genre are required" });
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

      const newBook = new Book({
        title,
        author,
        genre,
        ratings: ratings || 0,
        description: req.body.description || "",
        image: imageUrl,
      });

      await newBook.save();
      res
        .status(201)
        .json({ message: "Book added successfully", book: newBook });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//route to get all books
router.get("/allbooks", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const GENRES = [
  "mystery",
  "thriller",
  "history",
  "science_fiction",
  "romance",
  "fantasy",
  "biography",
  "crime",
  "dystopian",
  "adventure",
];

// Function to fetch books from Open Library API
async function fetchBooks() {
  let allBooks = [];

  for (const genre of GENRES) {
    try {
      console.log(`Fetching books for genre: ${genre}...`);
      const response = await axios.get(
        `https://openlibrary.org/subjects/${genre}.json?limit=50`
      );
      const books = response.data.works.map((book) => ({
        title: book.title,
        author: book.authors?.[0]?.name || "Unknown Author",
        genre: genre.replace("_", " "), // Format genre name
        ratings: (Math.random() * 5).toFixed(1), // Generate random ratings
        description: book.subject
          ? book.subject.join(", ")
          : "No description available",
        image: book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
          : "https://via.placeholder.com/150",
      }));

      allBooks.push(...books);
    } catch (error) {
      console.error(`Error fetching books for genre ${genre}:`, error.message);
    }
  }

  try {
    console.log(`📥 Inserting ${allBooks.length} books into MongoDB...`);
    await Book.insertMany(allBooks);
    console.log("✅ Books inserted successfully!");
  } catch (error) {
    console.error("Error inserting books:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
// fetchBooks(); run only once to add the books into the db

//  Get Recommended Books for Logged-in User
router.get("/recommended", protect, async (req, res) => {
  try {
    // Get logged-in user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user preferences
    const { genres, authors } = user.preferences;
    console.log(genres, authors);
    // Fetch recommended books based on preferences
    const recommendedBooks = await Book.find({
      $or: [
        { genre: { $in: genres.map((g) => new RegExp(`^${g}$`, "i")) } }, // Case-insensitive genre match
        { author: { $in: authors.map((a) => new RegExp(`^${a}$`, "i")) } }, // Case-insensitive author match
      ],
    });

    // Fetch other books that are NOT in recommendations
    const moreBooks = await Book.find({
      _id: { $nin: recommendedBooks.map((book) => book._id) },
    });

    // Send response
    res.json({
      message: "Books Retrieved Successfully",
      recommendedBooks,
      moreBooks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

//route to update book
router.put("/update/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update text fields
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.ratings = req.body.ratings || book.ratings;
    book.genre = req.body.genre || book.genre;
    book.description = req.body.description || book.description;

    // Update image only if a new file is uploaded
    if (req.file) {
      book.image = `/uploads/${req.file.filename}`;
    }

    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

//route to get single book based on id
router.get("/single/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book Retrieved Successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

//delete single book
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
