import Book from "../models/book.js";
import { validationResult, check } from "express-validator";

export const validateBook = [
  check("title", "Title is required").not().isEmpty(),
  check("author", "Author is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("publishedDate", "Published date is required").not().isEmpty(),
];

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, author, description, publishedDate } = req.body;
  try {
    const doesBookExist = await Book.findOne({ title, author });
    if (doesBookExist) {
      return res
        .status(409)
        .json({ error: "Book with the same title and author already exists" });
    }
    const newBook = new Book({
      title,
      author,
      description,
      publishedDate,
      user: req.user.id,
    });

    const book = await newBook.save();

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (err) {
    console.error("Error adding book:", err.message);

    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Invalid data provided", details: err.errors });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBook = async (req, res) => {
  const { title, author, description, publishedDate } = req.body;

  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.user !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, publishedDate },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.user !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
