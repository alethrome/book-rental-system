const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const BorrowedBookSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        book_id: {
            type: String
        },
        title: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'borrowed_at', 
            updatedAt: false
        },
        toJSON: {
            transform: function (doc, ret) {
                ret.borrowed_at = ret.borrowed_at ? moment(ret.borrowed_at).tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss') : null;
                return ret;
            }
        }
    }
);

const UserBorrowSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            ref: 'User'
        },
        fullname: {
            type: String,
            required: true
        },
        max_books: {
            type: Number,
            default: 5
        },
        borrowed:{
            type: [BorrowedBookSchema], 
            default: []
        }
    }
);

const Borrower = mongoose.model('Borrower', UserBorrowSchema);
module.exports = Borrower;