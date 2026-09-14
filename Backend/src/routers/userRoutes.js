const express = require('express');
const { getAllUsers, updateUser, deleteUser, getUserProfile, updateProfile, deleteProfile, updatePassword } = require('../controllers/userController');
const { getAddresses, createAddress, deleteAddress, updateAddress } = require('../controllers/addressController');
const router = express.Router();

// Specific routes before wildcard /:id
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateProfile);
router.delete('/profile/:userId', deleteProfile);
router.put('/password/:userId', updatePassword);

router.get('/addresses/:userId', getAddresses);
router.post('/addresses/:userId', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
