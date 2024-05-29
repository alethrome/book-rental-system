const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../config', 'public_key.pem');
const publicKey = fs.readFileSync(filePath, 'utf8');

async function checkAuth (req, res, next) {
    let cookies = Object.keys(req.cookies).length > 0 ? req.cookies : { authToken: ''};
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader) {
        return res.status(401).send('Access token is missing.');
    };

    const token = authorizationHeader.split(" ")[1];
 
    if (token != cookies['authToken']) {
        return res.status(401).send('Authentication failed.');
    };

    try {
        const result = jwt.verify(token, publicKey, {
            algorithm: 'RS256'
        });

        req.user = result;
        console.log(req.user);

        next();
    }
    catch (err) {
        res.status(400).send(err.message);
    };
};

module.exports = {
    checkAuth
}