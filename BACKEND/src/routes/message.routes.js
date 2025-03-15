const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validation middleware cho tạo và cập nhật message
const validateMessage = [
    body('session_id').notEmpty().withMessage('Session ID is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('role').notEmpty().withMessage('Role is required') // Đổi sender -> role
];

//Lưu tin nhắn
router.post('/', authMiddleware.authToken, validateMessage, messageController.saveMessage);

//Lấy danh sách message theo session
router.get('/session/:session_id', authMiddleware.authToken, messageController.getMessages);

module.exports = router;
