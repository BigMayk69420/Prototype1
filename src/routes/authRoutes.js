// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register user
router.post('/register', authMiddleware, authController.registerUser);

// Update user profile
router.put('/update-profile', authMiddleware, authController.updateProfile);

// Update user password
router.put('/update-password', authMiddleware, authController.updatePassword);

// Update user notification preferences
router.put('/update-notifications', authMiddleware, authController.updateNotificationPreferences);

module.exports = router;
