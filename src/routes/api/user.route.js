const express = require('express');
const router = express.Router();
const userController = require('../../controller/v1/user.controller');
const { addEditUserValidation, viewUserValidation } = require('../../validation/user.validation');
const { validatorFunction } = require('../../helpers/helper');

router.get('/', (req, res) => res.send('Welcome to User route'));

router.post('/add-edit-user', addEditUserValidation, validatorFunction, userController.addEditUser);
router.post('/list-user', userController.userList);
router.post('/view-user', viewUserValidation, validatorFunction, userController.viewUserDetails);

module.exports = router;
