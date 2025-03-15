const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin, validateChangePassword } = require('../middlewares/inputValidation.middleware');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware.authToken, authController.getProfile);
router.post(
    '/change-password',
    [authMiddleware.authToken, validateChangePassword],
    authController.changePassword
);

module.exports = router;