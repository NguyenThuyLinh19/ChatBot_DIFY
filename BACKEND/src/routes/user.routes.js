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

router.get('/getAllUser', userController.getAllUsers);
router.get('/:id', authMiddleware.authToken, userController.getUser);
router.post('/', validateUser, userController.createUser);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/:id/fullname', authMiddleware.authToken, userController.getUserFullName)

module.exports = router;
