const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Auth routes
router.post('/register', register);        // Register a new customer
router.post('/login', login);              // Login customer
router.post('/forgot-password', forgotPassword); // Forgot password
router.put('/reset-password/:resetToken', resetPassword); // Reset password

module.exports = router;
