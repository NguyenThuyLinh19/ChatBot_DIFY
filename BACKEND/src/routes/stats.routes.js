const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const messageController = require('../controllers/message.controller');

router.get('/stats', statsController.getStats);
router.get('/detail/:session_id', messageController.getMessages);

module.exports = router;
