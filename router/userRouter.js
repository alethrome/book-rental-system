const express = require('express');
const router = express.Router();

const { getAllUsers, getUser, createUser  } = require('../controller/user/userController');

router.get('/all', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);

module.exports = router;