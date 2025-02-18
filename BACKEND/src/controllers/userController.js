const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

const userController = {
    login: (req, res) => {
        const { username, password } = req.body;

        // Kiểm tra xem người dùng có tồn tại trong DB không
        User.getUserByUsername(username, (err, results) => { // Đổi từ result thành results
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (!results || results.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            const user = results[0]; // Lấy thông tin user đầu tiên

            // Kiểm tra mật khẩu
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Server error' });
                }
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Tạo token JWT
                const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

                // Trả về token cho frontend
                res.status(200).json({ message: 'Login successful', token });
            });
        });
    },
};

module.exports = userController;
