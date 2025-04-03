const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/knowledge.controller');

const upload = multer({ storage: multer.memoryStorage() }); // Lưu file trong bộ nhớ

router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
