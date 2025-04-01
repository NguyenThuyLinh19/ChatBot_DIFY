const db = require('../config/database');

class Chatbots {
    constructor(chatbot) {
        this.id = chatbot.id;
        this.user_id = chatbot.user_id;
        this.name = chatbot.name;
        this.description = chatbot.description;
        this.dify_chatbot_id = chatbot.dify_chatbot_id;
        this.status = chatbot.status;
        this.configuration = chatbot.configuration;
        this.created_at = chatbot.created_at; // Đổi từ create_at -> created_at
        this.updated_at = chatbot.updated_at; // Đổi từ update_at -> updated_at
    }

    // 🔹 Tạo chatbot mới
    static async createChatbot(user_id, name, description, dify_chatbot_id, status, configuration) {
        try {
            const query = `
                INSERT INTO Chatbots (user_id, name, description, dify_chatbot_id, status, configuration, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            const [result] = await db.execute(query, [user_id, name, description, dify_chatbot_id, status, configuration]);
            return result.insertId;
        } catch (error) {
            console.error("Lỗi khi tạo chatbot:", error);
            throw error;
        }
    }

    // 🔹 Lấy thông tin một chatbot theo ID
    static async getChatbotById(id) {
        try {
            const query = 'SELECT * FROM Chatbots WHERE id = ?';
            const [rows] = await db.execute(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error("Lỗi khi lấy chatbot theo ID:", error);
            throw error;
        }
    }

    // 🔹 Lấy tất cả chatbot của một người dùng
    static async getChatbotsByUser(user_id) {
        try {
            const query = 'SELECT * FROM Chatbots WHERE user_id = ? ORDER BY created_at DESC';
            const [rows] = await db.execute(query, [user_id]);
            return rows;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách chatbot:", error);
            throw error;
        }
    }

    //Cập nhật thông tin chatbot
    static async updateChatbot(id, updateData) {
        try {
            const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
            const values = Object.values(updateData);
            values.push(id);

            const query = `UPDATE Chatbots SET ${fields}, updated_at = NOW() WHERE id = ?`;
            const [result] = await db.execute(query, values);
            return result.affectedRows;
        } catch (error) {
            console.error("Lỗi khi cập nhật chatbot:", error);
            throw error;
        }
    }

    // 🔹 Xóa một chatbot theo ID
    static async deleteChatbot(id) {
        try {
            const query = 'DELETE FROM Chatbots WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Lỗi khi xóa chatbot:", error);
            throw error;
        }
    }
}

module.exports = Chatbots;
