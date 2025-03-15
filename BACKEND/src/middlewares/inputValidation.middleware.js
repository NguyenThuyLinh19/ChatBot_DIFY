const { body } = require('express-validator');

const validateFields = (fields) => {
    return fields.map(field => {
        switch (field) {
            case 'email':
                return body('email', 'Please enter a valid email').isEmail().normalizeEmail();
            case 'password':
                return body('password', 'Password must be at least 6 characters long').isLength({ min: 6 });
            case 'full_name':
                return body('full_name', 'Full name is required').trim().notEmpty();
            case 'currentPassword':
                return body('currentPassword', 'Current password is required').notEmpty();
            case 'newPassword':
                return body('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 });
            default:
                return [];
        }
    });
};

// Tạo các middleware từ hàm tổng quát
const validateRegister = validateFields(['email', 'password', 'full_name']);
const validateLogin = validateFields(['email', 'password']);
const validateChangePassword = validateFields(['currentPassword', 'newPassword']);

module.exports = {
    validateRegister,
    validateLogin,
    validateChangePassword
};
