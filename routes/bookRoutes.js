import express from 'express';
import { getBooks, addBook, updateBook, deleteBook,validateBook } from '../controllers/bookController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/books/get_books', authMiddleware, getBooks);
router.post('/books/add_book', authMiddleware, validateBook, addBook);
router.put('/books/:id', authMiddleware, updateBook);
router.delete('/books/:id', authMiddleware, deleteBook);

export default router;