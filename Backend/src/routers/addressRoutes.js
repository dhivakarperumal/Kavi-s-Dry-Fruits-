const express = require('express');
const { getAddresses, createAddress, deleteAddress, updateAddress } = require('../controllers/addressController');
const router = express.Router();

router.get('/:userId', getAddresses);
router.post('/:userId', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
