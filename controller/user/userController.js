const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const User = require("../../model/User");
const Borrower = require("../../model/Borrow");

async function getAllUsers(req, res, next) {
    try {
        const users = await User.find();
        return res.json(users);
    }
    catch (err) {
        return res.status(400).send(err.message)
    };
};

async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        return res.status(200).json(user);
    }
    catch (err) {
        return res.status(404).send(err.message);
    }
};

async function createUser(req, res) {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        const existingUser = await User.findOne({
            username: req.body.username
        });

        if(!existingUser) {
            const userRecord = await newUser.save();

            const newBorrower = new Borrower({
                _id: userRecord._id,
                fullname: userRecord.name
            });

            const borrowerRecord = await newBorrower.save();

            // await session.commitTransaction();
            // session.endSession();

            res.status(200).json({
                message: 'User was added succesfully.',
                user: userRecord,
                borrower: borrowerRecord
            });
        } else {
            return res.status(200).send('User already exists.');
        };

    }
    catch (err) {
        return res.status(404).send(err.message);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    createUser
}