const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthController {
    //Đăng ký tài khoản người dùng
    async register(req, res) {
        try {
            //Kiểm tra lỗi validate
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, full_name } = req.body;

            //Kiểm tra xem người dùng có tồn tại hay không
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email người dùng đã tồn tại!'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            //Tạo người dùng mới
            const user = new User({
                email,
                password_hash,
                full_name,
                is_active: true
            });

            const userId = await user.create();

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: userId,
                    email,
                    full_name
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user' });
        }
    }

    //Đăng nhập người dùng
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            console.log(email, password)

            //Kiểm tra người dùng
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    message: 'email hoặc mật khẩu không hợp lệ'
                });
            }

            //Kiểm tra tài khoản
            if (!user.is_active) {
                return res.status(401).json({
                    message: 'Tài khoản bị khóa!'
                });
            }

            //Xác thực mật khẩu
            const isValidPassword = await bcrypt.compare(
                password,
                user.password_hash
            );
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'email hoặc mật khẩu không hợp lệ'
                });
            }

            //Tạo JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name
                }
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ message: 'Lỗi đăng nhập' });
        }
    }

    //Lấy thông tin người dùng
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            // Remove sensitive data
            delete user.password_hash;

            res.json(user);
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ message: 'Lấy thông tin người dùng bị lỗi' });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Find user
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isValidPassword = await bcrypt.compare(
                currentPassword,
                user.password_hash
            );
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Current password is incorrect'
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);

            // Update password
            await User.update(user.id, { password_hash: newPasswordHash });

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: 'Error changing password' });
        }
    }
}

module.exports = new AuthController();