const express = require('express');
const { getAllUsers, updateUser, deleteUser, getUserProfile, updateProfile, updatePassword } = require('../controllers/userController');
const router = express.Router();

// Specific routes before wildcard /:id
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateProfile);
router.put('/password/:userId', updatePassword);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
