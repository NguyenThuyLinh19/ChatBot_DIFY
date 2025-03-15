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

// Routes
// Lấy tất cả phiên chat của một người dùng
router.get('/user/:user_id', authMiddleware.authToken, chatSessionController.getSessionsByUser);

// Tạo phiên chat mới
router.post('/', authMiddleware.authToken, validateChatSession, chatSessionController.createSession);

// Lấy thông tin phiên chat theo ID
router.get('/:id', authMiddleware.authToken, chatSessionController.getSession);

// Cập nhật thông tin phiên chat (nếu cần update các trường khác)
router.put('/:id', authMiddleware.authToken, chatSessionController.updateSession);

// Kết thúc phiên chat (update end_time)
router.put('/:id/end', authMiddleware.authToken, chatSessionController.endSession);

// Xóa phiên chat theo ID
router.delete('/:id', authMiddleware.authToken, chatSessionController.deleteSession);

module.exports = router;
