const db = require('../config/database'); // Kết nối MariaDB

class Message {
    //Lưu tin nhắn vào database
    static async createMessage(session_id, content, role) {
        const query = `INSERT INTO Messages (session_id, content, role) VALUES (?, ?, ?)`;
        await db.execute(query, [session_id, content, role]);
        return { success: true };
    }

    //Lấy tất cả tin nhắn của một phiên chat
    static async getMessagesBySession(session_id) {
        const query = `SELECT * FROM Messages WHERE session_id = ? ORDER BY created_at ASC`;
        const [messages] = await db.execute(query, [session_id]);
        return messages;
    }

    // Xóa cặp tin nhắn của người dùng và chatbot trong cùng một session
    static async deletePair(session_id, userContent, assistantContent) {
        const query = `
        DELETE FROM Messages 
        WHERE session_id = ? 
          AND ((role = 'user' AND content = ?) OR (role = 'assistant' AND content = ?))
    `;
        await db.execute(query, [session_id, userContent, assistantContent]);
        return { success: true };
    }
}

module.exports = Message;
