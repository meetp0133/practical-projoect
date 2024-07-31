const express = require('express');
const router = express.Router();
const projectController = require('../../controller/v1/project.controller');
const { addEditProjectValidation, viewProjectValidation } = require('../../validation/project.validation');
const { validatorFunction } = require('../../helpers/helper');

router.get('/', (req, res) => res.send('Welcome to Project route'));

router.post('/add-edit-project', addEditProjectValidation, validatorFunction, projectController.addEditProject);
router.post('/list-project', projectController.projectList);
router.post('/view-project', viewProjectValidation, validatorFunction, projectController.viewProjectDetails);
module.exports = router;
