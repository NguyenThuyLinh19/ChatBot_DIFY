const pool = require("../config/database"); // Kết nối MariaDB

class Message {
    //Lưu tin nhắn vào database
    static async saveMessage(sessionId, content, message) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                "INSERT INTO Messages (session_id, content, role) VALUES (?, ?, ?)",
                [sessionId, message, content]
            );
        } finally {
            conn.release();
        }
    }

    //Lấy tin nhắn theo session_id
    static async getMessages(sessionId) {
        const conn = await pool.getConnection();
        try {
            const [messages] = await conn.query(
                "SELECT content, role FROM Messages WHERE session_id = ? ORDER BY created_at ASC",
                [sessionId]
            );
            return messages;
        } finally {
            conn.release();
        }
    }
}

module.exports = Message;
