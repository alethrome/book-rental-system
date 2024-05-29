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

        let borrowRecord = await Borrower.findById(req.user.userId);


        if(borrowRecord.max_books <= 0) {
            return res.send('Limit for borrowed books reached.');
        };

        if(borrowRecord.borrowed.some(book => book.book_id === req.params.id)) {
            return res.send('Book is already borrowed.')
        }

        console.log(borrowRecord);

        borrowRecord.max_books -= 1;

        borrowRecord.borrowed.push({
            book_id: borrowBook._id,
            title: borrowBook.title
        });

        const borrowedBook = await borrowRecord.save();

        res.status(200).json({
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

        console.log(req.user);

        const borrowedBook = await Borrower.findOne({
            borrowed: { 
                $elemMatch: { book_id: req.params.id }
            }
        });

        console.log(borrowedBook);

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