const ChatSessions = require('../models/chatSession.model');

class ChatSessionController {
    // Tạo phiên chat mới
    async createSession(req, res) {
        try {
            const { user_id, chatbot_id } = req.body;
            const sessionId = await ChatSessions.createSession(user_id, chatbot_id);
            res.status(201).json({ message: 'Chat session created successfully', sessionId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy thông tin phiên chat theo ID
    async getSession(req, res) {
        try {
            const session = await ChatSessions.getSessionById(req.params.id);
            if (!session) {
                return res.status(404).json({ message: 'Chat session not found' });
            }
            res.json(session);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy tất cả phiên chat của một người dùng
    async getSessionsByUser(req, res) {
        try {
            const sessions = await ChatSessions.getSessionsByUser(req.params.user_id);
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Kết thúc phiên chat (cập nhật end_time)
    async endSession(req, res) {
        try {
            await ChatSessions.endSession(req.params.id);
            res.json({ message: 'Chat session ended successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Cập nhật thông tin phiên chat
    async updateSession(req, res) {
        try {
            const updateData = req.body; // Dữ liệu cập nhật (vd: chatbot_id, start_time, end_time nếu cần)
            const affectedRows = await ChatSessions.updateSession(req.params.id, updateData);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chat session not found' });
            }
            res.json({ message: 'Chat session updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Xóa phiên chat theo ID
    async deleteSession(req, res) {
        try {
            const affectedRows = await ChatSessions.deleteSession(req.params.id);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chat session not found' });
            }
            res.json({ message: 'Chat session deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ChatSessionController();
