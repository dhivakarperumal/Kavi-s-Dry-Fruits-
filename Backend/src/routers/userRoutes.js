const express = require('express');
const { getAllUsers, updateUser, deleteUser, getUserProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateProfile);

module.exports = router;
