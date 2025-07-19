const db = require('../config/database'); // Kết nối MariaDB

class BadFeedback {
    static async getBadResponses() {
        const query = `
            SELECT 
                m1.id AS user_msg_id,
                m1.content AS user_question,
                m2.id AS assistant_msg_id,
                m2.content AS assistant_answer,
                m1.created_at AS time,
                m1.session_id
            FROM Messages m1
            JOIN Messages m2 
            ON m2.session_id = m1.session_id 
            AND m2.role = 'assistant'
            AND m2.id = (
                SELECT MIN(m3.id)
                FROM Messages m3
                WHERE m3.session_id = m1.session_id
                AND m3.role = 'assistant'
                AND m3.id > m1.id
            )
            WHERE m1.role = 'user'
            AND (
                    m2.content LIKE '%xin lỗi%'
                    OR m2.content LIKE '%chưa tìm thấy%'
                    OR m2.content LIKE '%tôi không chắc%'
                    OR m2.content LIKE '%tôi chưa rõ%'
                )
            ORDER BY m1.created_at;

        `;

        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = BadFeedback;
