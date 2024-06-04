const sinon = require('sinon');
const dotenv = require('dotenv');
const { expect } = require('chai');
const mongoose = require('mongoose');

const {createBook, updateBook, deleteBook, getAllBooks, getBook} = require('../controller/book/bookController');
const {borrowBook, returnBook, getBorrower} = require('../controller/borrow/borrowController');
const Book = require('../model/Book');

dotenv.config();

describe('Rental System', function() {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    describe('Books', function(){
        
        describe('create book', function() {

            after(async () => {
                await Book.deleteOne({ isbn: "520583" });
            });

            it('Should successfully create new book', async function() {
                const req = {
                    body: {
                        title: "Percy Jackson and the Lightning Thief",
                        author: "Rick Riordan",
                        publisher: "publisher",
                        description: "This is a test book",
                        isbn: "520583",
                        status: "Available",
                        item_count: "5"
                    }
                };

                const res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }
    
                await createBook(req, res, null); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.include({ message: 'Book was added successfully.' });
                expect(res.json.firstCall.args[0]).to.have.property('book');
            });

            it('Should throw 400 error if book already exists', async function() {
                const req = {
                    body: {
                        title: "Percy Jackson and the Sea Monsters",
                        author: "Rick Riordan",
                        publisher: "publisher",
                        description: "This is a test book",
                        isbn: "622094",
                        status: "Available",
                        item_count: "5"
                    }
                };

                const res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }
    
                await createBook(req, res, null); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(400);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('Book already exists.');
            });
            
        });

        describe('update book', function() {
            it('Should successfully update book', async function() {

                const req = {
                    params: { id: '75b6b2b9-9b90-4ae0-a3f1-a89e54e52e27'},
                    body: {
                        title: "Percy Jackson and the Battle of Labyrinth",
                        author: "Rick Rior",
                        publisher: "publisher",
                        description: "This is a test update",
                        isbn: "51555-i239",
                        status: "Unavailable",
                        item_count: "5"
                    }
                };

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };

                await updateBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.include({ message: 'Book successfully updated' });
                expect(res.json.firstCall.args[0]).to.have.property('updatedBook');
            });

            it('Should throw 404 error if book is not found', async function() {

                let req = {
                    params: { id: '123' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await updateBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('No record found.');
            });
        });

        describe('delete book', function() {
            it('Should successfully delete a book', async function() {

                const req = { params: { id: '74fad598-6041-40c4-aac0-dfb2ca081c0f' }};

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await deleteBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.have.property('deleted_at');
            });

            it('Should throw 404 error if no record to be deleted', async function() {

                let req = {
                    params: { id: '123' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await updateBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('No record found.');
            });
        });

        describe('get book', function() {
            it('Should successfully get all books in directory', async function() {

                let req;

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await getAllBooks(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.be.an('array').to.not.have.any.keys('deleted_at');
            });

            it('Should successfully get a book by ID', async function() {

                let req = {
                    params: { id: '51c4a658-ac98-473c-8817-ce437058b5dc' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await getBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.have.property('_id');
            });

            it('Should throw 404 error if book is not found', async function() {

                let req = {
                    params: { id: '123' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await getBook(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('No record found');
            });
        });
    });

    describe('Borrow', function(){

        describe('borrowBook', () => {
            before(async () => {

                const req = ({
                    params: { id: '8b72f6c4-136e-4092-89a3-a1c0d476f1a1' },
                    user: { userId: 'b266503f-a495-4111-a2d9-515260092ea3' }
                });

                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: 1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                bookStub.withArgs({borrowed: {  
                    $elemMatch: { book_id: req.params.id }}
                });

                const borrowedStub = sinon.stub();
                bookStub.withArgs(
                    req.user.userId, 
                    { 
                        $inc: { max_books: 1 },
                        $pull: { borrowed: { book_id: req.params.id }}},
                    { new: true }
                );

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }; 

                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { 
                        findOne: borrowerStub,
                        findByIdAndUpdate: borrowedStub 
                    }
                };

                await returnBook(req, res, null, dependencies);

            });

            it('should borrow a book successfully', async () => {

                const req = ({
                    params: { id: '8b72f6c4-136e-4092-89a3-a1c0d476f1a1' },
                    user: { userId: 'b266503f-a495-4111-a2d9-515260092ea3' }
                });
        
                // Stub Book.findByIdAndUpdate to return a mock book
                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: -1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                borrowerStub.withArgs({_id: req.user.userId});

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };
        
                // Replace the original functions with the stubs
                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { findOne: borrowerStub }
                };
        
                await borrowBook(req, res, null, dependencies);

                
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.include({ message: 'Successfully borrowed a book' });
                expect(res.json.firstCall.args[0]).to.have.property('borrowed');
            });

            it('Should throw 404 error if book is not available for borrow', async () => {

                const req = ({
                    params: { id: '123' },
                    user: { userId: 'b266503f-a495-4111-a2d9-515260092ea3' }
                });
        
                // Stub Book.findByIdAndUpdate to return a mock book
                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: -1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                borrowerStub.withArgs({_id: req.user.userId});

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };
        
                // Replace the original functions with the stubs
                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { findOne: borrowerStub }
                };
        
                await borrowBook(req, res, null, dependencies);

                
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('No record found');
            });

            it('Should throw 400 error if book status is unavailable', async () => {

                const req = ({
                    params: { id: '75b6b2b9-9b90-4ae0-a3f1-a89e54e52e27' },
                    user: { userId: 'b266503f-a495-4111-a2d9-515260092ea3' }
                });
        
                // Stub Book.findByIdAndUpdate to return a mock book
                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: -1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                borrowerStub.withArgs({_id: req.user.userId});

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };
        
                // Replace the original functions with the stubs
                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { findOne: borrowerStub }
                };
        
                await borrowBook(req, res, null, dependencies);

                
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(400);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('This book is unavailable.');
            });

            it('should throw 404 error if borrower\'s max books limit reached', async () => {

                const req = ({
                    params: { id: '51c4a658-ac98-473c-8817-ce437058b5dc' },
                    user: { userId: 'a62a4fed-29e1-473e-9514-f7f4f4ddbb40' }
                });
        
                // Stub Book.findByIdAndUpdate to return a mock book
                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: -1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                borrowerStub.withArgs({_id: req.user.userId});

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };
        
                // Replace the original functions with the stubs
                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { findOne: borrowerStub }
                };
        
                await borrowBook(req, res, null, dependencies);

                
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(400);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('Limit for borrowed books reached.');
            });

            it('should throw 400 error if book is already borrowed', async () => {

                const req = ({
                    params: { id: '51c4a658-ac98-473c-8817-ce437058b5dc' },
                    user: { userId: '715c2bad-0980-49e5-bfc7-b83d56999358' }
                });

                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: -1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                borrowerStub.withArgs({_id: req.user.userId});

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                };
        
                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { findOne: borrowerStub }
                };
        
                await borrowBook(req, res, null, dependencies);

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(400);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.include('Book is already borrowed.');
            });
        });

        describe('return book', function() {
            it('Should successfully return book', async function() {

                const req = ({
                    params: { id: '8b72f6c4-136e-4092-89a3-a1c0d476f1a1' },
                    user: { userId: 'cd6bfcc5-5eea-471f-966b-d2a791ac6c42' }
                });

                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: 1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                bookStub.withArgs({borrowed: {  
                    $elemMatch: { book_id: req.params.id }}
                });

                const borrowedStub = sinon.stub();
                bookStub.withArgs(
                    req.user.userId, 
                    { 
                        $inc: { max_books: 1 },
                        $pull: { borrowed: { book_id: req.params.id }}},
                    { new: true }
                );

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }; 

                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { 
                        findOne: borrowerStub,
                        findByIdAndUpdate: borrowedStub 
                    }
                };

                await returnBook(req, res, null, dependencies);

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.include({ message: 'Successfully returned a book' });
                expect(res.json.firstCall.args[0]).to.have.property('borrowRecord');
            });

            it('Should return 404 error if book is not found', async function() {

                const req = ({
                    params: { id: '123' },
                    user: { userId: 'cd6bfcc5-5eea-471f-966b-d2a791ac6c42' }
                });

                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: 1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                bookStub.withArgs({borrowed: {  
                    $elemMatch: { book_id: req.params.id }}
                });

                const borrowedStub = sinon.stub();
                bookStub.withArgs(
                    req.user.userId, 
                    { 
                        $inc: { max_books: 1 },
                        $pull: { borrowed: { book_id: req.params.id }}},
                    { new: true }
                );

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }; 

                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { 
                        findOne: borrowerStub,
                        findByIdAndUpdate: borrowedStub 
                    }
                };

                await returnBook(req, res, null, dependencies);

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('Book not found.');
            });

            it('Should throw 404 error if the book is not borrowed', async function() {

                const req = ({
                    params: { id: '75b6b2b9-9b90-4ae0-a3f1-a89e54e52e27' },
                    user: { userId: 'cd6bfcc5-5eea-471f-966b-d2a791ac6c42' }
                });

                const bookStub = sinon.stub();
                bookStub.withArgs(req.params.id, { $inc: { item_count: 1 } }, { new: true, runValidators: true })

                const borrowerStub = sinon.stub();
                bookStub.withArgs({borrowed: {  
                    $elemMatch: { book_id: req.params.id }}
                });

                const borrowedStub = sinon.stub();
                bookStub.withArgs(
                    req.user.userId, 
                    { 
                        $inc: { max_books: 1 },
                        $pull: { borrowed: { book_id: req.params.id }}},
                    { new: true }
                );

                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub(),
                    json: sinon.stub(),
                }; 

                const dependencies = {
                    Book: { findByIdAndUpdate: bookStub },
                    Borrower: { 
                        findOne: borrowerStub,
                        findByIdAndUpdate: borrowedStub 
                    }
                };

                await returnBook(req, res, null, dependencies);

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('Borrowed book not found.');
            });
        });

        describe('get borrower by id', function() {
            
            it('Should successfully get a borrowers by ID', async function() {
                let req = {
                    params: { id: 'b266503f-a495-4111-a2d9-515260092ea3' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await getBorrower(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(200);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.firstCall.args[0]).to.have.property('borrower');
            });

            it('Should throw 404 error if borrower does not exist', async function() {
                let req = {
                    params: { id: 'b266503f' }
                };
                
                res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.spy(),
                    json: sinon.spy(),
                };

                await getBorrower(req, res); 

                expect(res.status.calledOnce).to.be.true;
                expect(res.status.firstCall.args[0]).to.equal(404);
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.firstCall.args[0]).to.equal('Borrower not found.');
            });
        });
    });
});