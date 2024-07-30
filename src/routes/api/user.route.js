const express = require('express');
const router = express.Router();
const userController = require('../../controller/v1/user.controller');

router.get('/', (req, res) => res.send('Welcome to User route'));

router.post('/add-edit-user', userController.addEditUser);
router.post('/list-user', userController.userList);

module.exports = router;
