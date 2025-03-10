const Chatbots = require('../models/chatbot.model');

class ChatbotController {
    // Tạo chatbot mới
    async createChatbot(req, res) {
        try {
            const { user_id, name, description, dify_chatbot_id, status, configuration } = req.body;
            const chatbotId = await Chatbots.createChatbot(
                user_id, name, description, dify_chatbot_id, status, configuration
            );
            res.status(201).json({ message: 'Tạo chatbot thành công', chatbotId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy thông tin chatbot theo ID
    async getChatbot(req, res) {
        try {
            const chatbot = await Chatbots.getChatbotById(req.params.id);
            if (!chatbot) {
                return res.status(404).json({ message: 'Chatbot not found' });
            }
            res.json(chatbot);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy danh sách chatbot của một người dùng
    async getChatbotsByUser(req, res) {
        try {
            const chatbots = await Chatbots.getChatbotsByUser(req.params.user_id);
            res.json(chatbots);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Cập nhật thông tin chatbot
    async updateChatbot(req, res) {
        try {
            const updateData = req.body; // Dữ liệu cập nhật như name, description, status, configuration, ... 
            const affectedRows = await Chatbots.updateChatbot(req.params.id, updateData);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chatbot not found' });
            }
            res.json({ message: 'Chatbot updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Xóa chatbot theo ID
    async deleteChatbot(req, res) {
        try {
            const affectedRows = await Chatbots.deleteChatbot(req.params.id);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chatbot not found' });
            }
            res.json({ message: 'Chatbot deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ChatbotController();
