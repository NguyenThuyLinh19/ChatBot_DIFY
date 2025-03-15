const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const validateUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty()
];

router.get('/:id', authMiddleware.authToken, userController.getUser);
router.get('/', userController.getAllUsers);
router.post('/', validateUser, userController.createUser);
router.put('/:id', authMiddleware.authToken, userController.updateUser);
router.delete('/:id', authMiddleware.authToken, userController.deleteUser);

module.exports = router;
