const db = require('../config/database');

const getStats = async () => {
    try {
        const [users] = await db.query('SELECT COUNT(*) AS totalUsers FROM Users');
        const [chatbots] = await db.query('SELECT COUNT(*) AS totalChatSessions FROM ChatSessions');

        return {
            totalUsers: users[0].totalUsers,
            totalChatSessions: chatbots[0].totalChatSessions
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { getStats };