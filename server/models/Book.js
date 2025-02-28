const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    // add descriptions:
    description: { type: String, trim: true },
    image: { type: String, required: true } // Ensure image URL is provided
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
