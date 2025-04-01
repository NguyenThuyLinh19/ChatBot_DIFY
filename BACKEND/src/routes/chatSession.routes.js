const express = require('express');
const router = express.Router();
const chatSessionController = require('../controllers/chatSession.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validation middleware cho tạo phiên chat
const validateChatSession = [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('chatbot_id').notEmpty().withMessage('Chatbot ID is required')
];

router.get('/admin/chat_sessionsList', chatSessionController.getAllChatSessions);
router.get('/user/:user_id', authMiddleware.authToken, chatSessionController.getSessionsByUser);
router.post('/', authMiddleware.authToken, validateChatSession, chatSessionController.createSession);
router.get('/:id', authMiddleware.authToken, chatSessionController.getSession);
router.put('/:id', authMiddleware.authToken, chatSessionController.updateSession);
router.put('/:id/end', authMiddleware.authToken, chatSessionController.endSession);
router.delete('/:id', authMiddleware.authToken, chatSessionController.deleteSession);

module.exports = router;
