const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');

// Danh sách người dùng giả lập (bạn có thể thay thế bằng cơ sở dữ liệu)
let users = [];

// Đăng ký người dùng
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng vào danh sách (bạn có thể thay thế bằng cơ sở dữ liệu)
    users.push({ email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'Đăng ký thành công' });
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra người dùng có tồn tại không
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(400).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu sai' });
    }

    // Tạo JWT
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
    });
};

const router = express.Router();
// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

module.exports = router;
// Exports các controller
module.exports = {
    registerUser,
    loginUser,
};
