const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Create new user
router.post('/', userController.createUser);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Upload resume
router.post('/:id/resume', userController.uploadResume);

module.exports = router;