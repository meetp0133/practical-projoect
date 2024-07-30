const express = require('express');
const router = express.Router();
const projectController = require('../../controller/v1/project.controller');

router.get('/', (req, res) => res.send('Welcome to Project route'));

router.post('/add-edit-project', projectController.addEditProject);
// router.post('/list-project', projectController.viewProfile);

module.exports = router;
