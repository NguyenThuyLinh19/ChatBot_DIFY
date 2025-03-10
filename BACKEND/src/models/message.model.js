const db = require('../config/database');

class Messages {
    constructor(message) {
        this.id = message.id;
        this.session_id = message.session_id;
        this.content = message.content;
        this.role = message.role;
        this.create_at = message.create_at;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Messages WHERE id = ?', 
            [id]
        );
        return rows;
    }

    static async findBySessionId(sessionId) {
        const [rows] = await db.execute(
            'SELECT * FROM Messages WHERE session_id = ?', 
            [sessionId]
        );
        return rows[0];
    }    

    async create() {
        const sql = `
            INSERT INTO Messages (
                id, session_id, content, 
                role, create_at
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            this.id,
            this.session_id,
            this.content,
            this.role,
            this.create_at
        ]);
        return result.insertId;
    }

    static async update(id, updateData) {
        const sql = 'UPDATE Messages SET ? WHERE id = ?';
        const [result] = await db.execute(sql, [updateData, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const sql = 'DELETE FROM Messages WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Messages;