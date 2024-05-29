const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const BookSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        publisher: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        isbn: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Available','Unavailable'],
            default: 'Available'
        },
        item_count: {
            type: Number
        },
        deleted_at: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;