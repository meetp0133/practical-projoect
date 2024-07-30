const express = require('express');
const router = express.Router();

// User LRF route
const userRoutes = require('./api/user.route');
router.use('/api/user/', userRoutes);

// Project route
const projectRoutes = require('./api/project.route');
router.use('/api/project/', projectRoutes);

module.exports = router;    