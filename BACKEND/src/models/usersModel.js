const db = require('../config/database');

const User = {
    createUser: (username, password, email, callback) => {
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(query, [username, password, email], callback);
    },

    getAllUsers: (callback) => {
        const query = 'SELECT * FROM users';
        db.query(query, callback);
    },

    // Thêm hàm lấy user theo username
    getUserByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], callback);
    }
};

module.exports = User;
