const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedback.controller');

router.get('/bad-responses', FeedbackController.getBadResponses);

module.exports = router;
