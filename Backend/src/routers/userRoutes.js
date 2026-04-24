const express = require('express');
const { getAllUsers, updateUser, deleteUser, getUserProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();

// Specific routes before wildcard /:id
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateProfile);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
