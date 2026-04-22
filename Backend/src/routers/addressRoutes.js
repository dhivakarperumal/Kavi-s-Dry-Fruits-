const express = require('express');
const { getAddresses, createAddress, deleteAddress } = require('../controllers/addressController');
const router = express.Router();

router.get('/:userId', getAddresses);
router.post('/:userId', createAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
