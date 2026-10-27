const express = require('express');
const { getAddresses, createAddress, deleteAddress, updateAddress } = require('../controllers/addressController');
const { authenticate, authorizeSelfOrAdmin, authorizeAddressOwner } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);
router.get('/:userId', authorizeSelfOrAdmin(), getAddresses);
router.post('/:userId', authorizeSelfOrAdmin(), createAddress);
router.put('/:id', authorizeAddressOwner, updateAddress);
router.delete('/:id', authorizeAddressOwner, deleteAddress);

module.exports = router;
