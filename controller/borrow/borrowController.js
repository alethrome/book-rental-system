const Borrower = require('../../model/Borrow');
const Book = require('../../model/Book');


async function borrowBook(req, res, next) {
    try {
        const borrowBook = await Book.findByIdAndUpdate(
            req.params.id, 
            {
                $inc: { item_count: -1 }
            },
            { new: true, runValidators: true }
        );

        if(!borrowBook || !borrowBook._id) {
            return res.status(404).send('No record found');
        };
        
        if(borrowBook.status.toLowerCase() === "unavailable") {
            return res.status(400).send('This book is unavailable.');
        }

        let borrowRecord = await Borrower.findOne({ _id: req.user.userId});

        // if(!borrowRecord) {
        //     return res.status(404).send('No borrower');
        // }

        if(borrowRecord.max_books <= 0) {
            return res.status(400).send('Limit for borrowed books reached.');
        };

        let isBookBorrowed = borrowRecord.borrowed.some(borrowedBook => borrowedBook.book_id === req.params.id);

        if (isBookBorrowed) {
            return res.status(400).send('Book is already borrowed.');
        }

        borrowRecord.max_books -= 1;

        borrowRecord.borrowed.push({
            book_id: borrowBook._id,
            title: borrowBook.title
        });

        const borrowedBook = await borrowRecord.save();

        return res.status(200).json({
            message: 'Successfully borrowed a book',
            borrowed: borrowedBook
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    };
};

async function returnBook(req, res, next) {
    try {
        const borrowBook = await Book.findByIdAndUpdate(
            req.params.id, 
            {
                $inc: { item_count: 1 }
            },
            { new: true, runValidators: true }
        );

        if(!borrowBook || !borrowBook._id) {
            return res.status(404).send('Book not found.')
        };

        const borrowedBook = await Borrower.findOne({
            borrowed: { 
                $elemMatch: { book_id: req.params.id }
            }
        });

        if (!borrowedBook) {
            return res.status(404).send('Borrowed book not found.')
        };

        const borrowRecord = await Borrower.findByIdAndUpdate(
            req.user.userId, 
            { 
                $inc: { max_books: 1 },
                $pull: { borrowed: { book_id: req.params.id }}},
            { new: true }
        );

        return res.status(200).json({
            message: 'Successfully returned a book',
            borrowRecord: borrowRecord
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    };
};

async function getBorrower(req, res, next) {
    try {
        const borrower = await Borrower.findById(req.params.id);

        if(borrower && borrower._id) {
            return res.status(200).json({
                borrower: borrower
            });
        } else {
            return res.status(404).send('Borrower not found.')
        };
    } catch (err) {
        return res.status(400).send(err.message)
    }
};

module.exports = {
    borrowBook,
    returnBook,
    getBorrower
}