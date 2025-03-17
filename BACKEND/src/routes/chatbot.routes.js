const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validation middleware cho tạo chatbot
const validateChatbot = [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('dify_chatbot_id').notEmpty().withMessage('Dify Chatbot ID is required'),
    body('status').notEmpty().withMessage('Status is required'),
    body('configuration').notEmpty().withMessage('Configuration is required')
];

// Routes
// Lấy danh sách chatbot của một người dùng
router.get('/user/:user_id', authMiddleware.authToken, chatbotController.getChatbotsByUser);

// Tạo chatbot mới
router.post('/', authMiddleware.authToken, validateChatbot, chatbotController.createChatbot);

// Lấy thông tin chatbot theo ID
router.get('/:id', authMiddleware.authToken, chatbotController.getChatbot);

// Cập nhật thông tin chatbot theo ID
router.put('/:id', authMiddleware.authToken, chatbotController.updateChatbot);

// Xóa chatbot theo ID
router.delete('/:id', authMiddleware.authToken, chatbotController.deleteChatbot);

// Chat với chatbot
router.post('/ChatDify', chatbotController.ChatDify)

module.exports = router;
