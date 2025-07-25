const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserController {
    // getAllUsers trong user.controller.js
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll(); // Giả sử model User có phương thức findAll
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get user by ID
    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            delete user.password_hash; // Don't send password hash
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //Get full name of user 
    async getUserFullName(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Trả về full_name
            res.json({ full_name: user.full_name });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create new user
    async createUser(req, res) {
        try {
            const { email, password, full_name } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({
                email,
                password_hash,
                full_name,
                is_active: true
            });

            const userId = await user.create();
            res.status(201).json({
                message: 'User created successfully',
                userId
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user
    async updateUser(req, res) {
        try {
            const { email, full_name } = req.body;
            const updateData = { email, full_name };

            const result = await User.update(req.params.id, updateData);
            if (result === 0) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
            res.json({ message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            const result = await User.delete(req.params.id);
            if (result === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchUser(req, res) {
        try {
            const query = req.query.query;
            if (!query) {
                return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
            }

            const users = await User.searchUsers(query); // Gọi model để lấy dữ liệu
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = new UserController();