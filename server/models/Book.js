const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: String,
      },
      grade: {
        type: Number,
      },
    },
  ],
  averageRating: Number,
});


const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
