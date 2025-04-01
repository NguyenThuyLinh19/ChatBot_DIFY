const fetch = require('node-fetch');
const KnowledgeModel = require('../models/knowledge.model');

const uploadKnowledge = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Tạo instance KnowledgeModel với file
        const knowledge = new KnowledgeModel(req.file);

        // Gửi file lên Dify sử dụng fetch
        const response = await fetch(process.env.DIFY_API_UPLOAD, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
            },
            body: knowledge.file.buffer, // Gửi file dưới dạng buffer
        });

        // Kiểm tra nếu có lỗi từ Dify
        if (!response.ok) {
            throw new Error(`Failed to upload: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error uploading knowledge:", error);
        res.status(500).json({ error: "Failed to upload knowledge" });
    }
};

module.exports = { uploadKnowledge }
