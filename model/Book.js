const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment-timezone');

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
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret.createdAt = ret.createdAt ? moment(ret.createdAt).tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss') : null;
                ret.updatedAt = ret.updatedAt ? moment(ret.updatedAt).tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss') : null;
                return ret;
            }
        }
    }
);

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;