const express = require('express');
const router = express.Router();
const multer = require('multer');
const KnowledgeController = require('../controllers/knowledge.controller');

// Cấu hình Multer để lưu file vào bộ nhớ (memory storage)
const upload = multer({ storage: multer.memoryStorage() });
router.post("/upload", KnowledgeController.uploadKnowledge);

module.exports = router;
