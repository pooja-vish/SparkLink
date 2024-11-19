
const express = require('express');
const { register, login, confirmEmail, logout, checkSession, authStatus, forgotPassword, verifyToken, resetPassword, getallusers} = require('../controllers/userController');

const router = express.Router();

// POST route for user registration
router.post("/register", register);
router.get("/confirm-email", confirmEmail);

// POST route for user login
router.post('/login', login);
router.post('/logout', logout);
router.get('/auth-status',authStatus);
router.post('/forgot-password', forgotPassword);
router.get('/allusers',getallusers);

router.get("/reset-password", verifyToken);
router.post("/reset-password", resetPassword);
// router.post('/reset-email-sent', sendResetEmail);

module.exports = router;
