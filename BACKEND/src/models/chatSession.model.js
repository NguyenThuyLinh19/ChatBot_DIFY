const db = require('../config/database');

class ChatSessions {
    constructor(Sessions) {
        this.id = Sessions.id;
        this.user_id = Sessions.user_id;
        this.chatbot_id = Sessions.chatbot_id;
        this.start_time = Sessions.start_time;
        this.end_time = Sessions.end_time;
    }

    // Tạo một phiên trò chuyện mới
    static async createSession(user_id, chatbot_id) {
        const query = 'INSERT INTO chat_sessions (user_id, chatbot_id, start_time) VALUES (?, ?, NOW())';
        const [result] = await db.execute(query, [user_id, chatbot_id]);
        return result.insertId;
    }

    // Lấy thông tin một phiên trò chuyện theo ID
    static async getSessionById(session_id) {
        const query = 'SELECT * FROM chat_sessions WHERE id = ?';
        const [rows] = await db.execute(query, [session_id]);
        return rows.length ? rows[0] : null;
    }

    // Lấy tất cả phiên trò chuyện của một người dùng
    static async getSessionsByUser(user_id) {
        const query = 'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY start_time DESC';
        const [rows] = await db.execute(query, [user_id]);
        return rows;
    }

    // Cập nhật thời gian kết thúc của phiên trò chuyện
    static async endSession(session_id) {
        const query = 'UPDATE chat_sessions SET end_time = NOW() WHERE id = ?';
        await db.execute(query, [session_id]);
    }

    // Cập nhật thông tin phiên trò chuyện
    static async updateSession(session_id, updateData) {
        const query = 'UPDATE chat_sessions SET ? WHERE id = ?';
        const [result] = await db.execute(query, [updateData, session_id]);
        return result.affectedRows;
    }

    // Xóa một phiên trò chuyện theo ID
    static async deleteSession(session_id) {
        const query = 'DELETE FROM chat_sessions WHERE id = ?';
        const [result] = await db.execute(query, [session_id]);
        return result.affectedRows;
    }
}

module.exports = ChatSessions;
