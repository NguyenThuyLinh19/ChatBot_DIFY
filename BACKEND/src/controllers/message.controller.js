const Message = require('../models/message.model');

class MessageController {
    // Tạo message mới cho một phiên chat
    async createMessage(req, res) {
        try {
            const { session_id, sender, content } = req.body;
            // Bạn có thể thực hiện kiểm tra dữ liệu đầu vào tại đây

            // Tạo mới message (giả sử Message.create trả về ID của message được tạo)
            const messageId = await Message.create({ session_id, sender, content });
            res.status(201).json({ message: 'Message created successfully', messageId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy thông tin message theo ID
    async getMessage(req, res) {
        try {
            const message = await Message.getById(req.params.id);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            res.json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy tất cả các message theo session_id
    async getMessagesBySession(req, res) {
        try {
            const messages = await Message.getBySession(req.params.session_id);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Cập nhật nội dung message
    async updateMessage(req, res) {
        try {
            const { content } = req.body;
            const updateData = { content };

            const affectedRows = await Message.update(req.params.id, updateData);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Message not found' });
            }
            res.json({ message: 'Message updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Xóa message theo ID
    async deleteMessage(req, res) {
        try {
            const affectedRows = await Message.delete(req.params.id);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Message not found' });
            }
            res.json({ message: 'Message deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new MessageController();
