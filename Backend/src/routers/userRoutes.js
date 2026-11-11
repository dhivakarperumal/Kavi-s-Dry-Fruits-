const express = require('express');
const { getAllUsers, updateUser, deleteUser, getUserProfile, updateProfile, deleteProfile, updatePassword } = require('../controllers/userController');
const { getAddresses, createAddress, deleteAddress, updateAddress } = require('../controllers/addressController');
const { authenticate, requireAdmin, authorizeSelfOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Specific routes before wildcard /:id
router.get('/profile/:userId', authorizeSelfOrAdmin(), getUserProfile);
router.put('/profile/:userId', authorizeSelfOrAdmin(), updateProfile);
router.delete('/profile/:userId', authorizeSelfOrAdmin(), deleteProfile);
router.put('/password/:userId', authorizeSelfOrAdmin(), updatePassword);

router.get('/addresses/:userId', authorizeSelfOrAdmin(), getAddresses);
router.post('/addresses/:userId', authorizeSelfOrAdmin(), createAddress);
router.put('/addresses/:id', requireAdmin, updateAddress);
router.delete('/addresses/:id', requireAdmin, deleteAddress);

router.get('/', requireAdmin, getAllUsers);
router.put('/:id', requireAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
