const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const bookRouter = require('./router/bookRouter');
const userRouter = require('./router/userRouter');
const loginRouter = require('./router/loginRouter');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Database connection is successful"))
.catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/', loginRouter);

app.get('/cookies', (req, res) => {
    const cookies = req.cookies;
    res.json(cookies);
})

app.listen(process.env.PORT, () => {
    console.log(`App listening to port ${process.env.PORT}`);
});