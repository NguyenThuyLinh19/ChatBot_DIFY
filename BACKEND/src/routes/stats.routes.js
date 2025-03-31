const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/stats', statsController.getStats);

module.exports = router;
