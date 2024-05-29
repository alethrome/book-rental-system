const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;