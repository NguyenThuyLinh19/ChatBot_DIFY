const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//API login 
router.get('/login', userController.login);

module.exports = router;
