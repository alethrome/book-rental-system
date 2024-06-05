const Book = require('../../model/Book');

async function getAllBooks(req, res, next) {
    try {
        const books = await Book.find({ 
            $or: [
                { deleted_at: { $exists: false }},
                { deleted_at: null }
            ]
        });

        return res.status(200).json(books);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
};

async function getBook(req, res, next) {
    try {
        const book = await Book.findById(req.params.id);

        if (!book || book.deleted_at != null) {
            return res.status(404).send('No record found');
        }

        return res.status(200).json(book);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
};

async function updateBook(req, res, next) {
    const book_id = req.params.id;
    const updateData = req.body;

    try {
        const book = await Book.findOne({ _id: book_id, deleted_at: null });

        const uniqueBook = await Book.findOne({  isbn: updateData.isbn, deleted_at: null });

        if(uniqueBook && uniqueBook._id != req.params.id) {
            return res.status(400).send('Book already exists.');
        }

        if(book) {
            const updatedBook = await Book.findByIdAndUpdate(
                { _id: book_id, deleted_at: null },
                updateData,
                { new: true }
            );

            return res.status(200).json({ 
                message: "Book successfully updated",
                updatedBook: updatedBook
            });
        } else {
            return res.status(404).send('No record found.')
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

async function createBook(req, res, next) {
    const newBook = new Book({
        ...req.body
    });

    const uniqueBook = await Book.findOne({  isbn: newBook.isbn, deleted_at: null });

    if(uniqueBook) {
        return res.status(400).send('Book already exists.');
    }

    try {
        const newRecord = await newBook.save();
        
        return res.status(200).json({ 
            message: 'Book was added successfully.',
            book: newRecord
        });
        
    }
    catch (err) {
        return res.status(400).send(err.message);
    };
};

async function deleteBook(req, res, next) {
    const deleteData = new Date();
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { deleted_at: deleteData},
            { new: true }
        );

        if(!updatedBook) {
            return res.status(404).send('No record found.')
        }

        return res.status(200).json({
            message: "Book is successfully deleted",
            deleted: updatedBook
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    getAllBooks,
    getBook,
    updateBook,
    createBook,
    deleteBook
}