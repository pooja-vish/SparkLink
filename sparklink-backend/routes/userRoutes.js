const express = require('express');
const { register, login, confirmEmail, logout, checkSession, authStatus} = require('../controllers/userController');
const router = express.Router();

// POST route for user registration
router.post('/register', register);
router.get('/confirm-email', confirmEmail);

// POST route for user login
router.post('/login', login);
router.post('/logout', logout);
router.get('/auth-status',authStatus);



module.exports = router;
