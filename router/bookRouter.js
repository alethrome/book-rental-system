const express = require('express');
const router = express.Router();

const { getAllBooks, getBook, createBook, updateBook, deleteBook  } = require('../controller/book/bookController');
const { borrowBook, returnBook, getBorrower  } = require('../controller/borrow/borrowController');
const { checkAuth  } = require('../middleware/authenticateUser');


router.get('/all', checkAuth, getAllBooks);
router.get('/:id', checkAuth, getBook);
router.post('/', checkAuth, createBook);
router.put('/:id', checkAuth, updateBook);
router.patch('/delete/:id', checkAuth, deleteBook);

router.put('/borrow/:id', checkAuth, borrowBook);
router.put('/return/:id', checkAuth, returnBook);
router.get('/borrower/:id', checkAuth, getBorrower);



module.exports = router;