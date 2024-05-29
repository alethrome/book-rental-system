const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

const User = require('../../model/User');
const filePath = path.join(__dirname, '../../config', 'private_key.pem');
const privateKey = fs.readFileSync(filePath, 'utf8');


async function login(req, res, next) {
    try {
        const user = await User.findOne({
            username: req.body.username
        });

        if(user && user._id) {  
            const isValidPassword = bcrypt.compare(
                req.body.password,
                user.password
            )

            if(isValidPassword) {
                const userObject = {
                    userId: user._id,
                    username: user.fullname
                };
    
                const token = jwt.sign(userObject, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: process.env.JWT_EXPIRY
                });
    
                res.cookie('authToken', token, {
                    httpOnly: true,
                    sameSite: 'Strict'
                });
    
                return res.send({ accessToken: token });
            } else {
                return res.status(400).send('Login failed.');
            }
        } else {
            return res.status(400).send('Login failed.')
        };
    }
    catch (err) {
        return res.status(400).send(err.message)
    };
};

function logout(req, res, next) {
    res.clearCookie('authToken');
    res.send('Logged out successfully.');
};

module.exports = {
    login,
    logout
}