const Message = require("../models/message.model");

//Controller để xử lý gửi tin nhắn
const sendMessage = async (req, res) => {
    const { session_id, message, role } = req.body;

    if (!session_id || !message || !role) {
        return res.status(400).json({ error: "Thiếu thông tin tin nhắn" });
    }

    try {
        await Message.saveMessage(session_id, message, role);
        res.json({ success: true, message: "Tin nhắn đã lưu!" });
    } catch (error) {
        console.error("Lỗi lưu tin nhắn:", error);
        res.status(500).json({ error: "Lỗi lưu tin nhắn" });
    }
};

//Controller để lấy lịch sử tin nhắn
const getMessages = async (req, res) => {
    const { session_id } = req.params;

    if (!session_id) {
        return res.status(400).json({ error: "Thiếu session_id" });
    }

    try {
        const messages = await Message.getMessages(session_id);
        res.json({ messages });
    } catch (error) {
        console.error("Lỗi lấy tin nhắn:", error);
        res.status(500).json({ error: "Lỗi lấy tin nhắn" });
    }
};

module.exports = { sendMessage, getMessages };
