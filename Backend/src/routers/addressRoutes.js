const express = require('express');
const { getAddresses, createAddress } = require('../controllers/addressController');
const router = express.Router();

router.get('/:userId', getAddresses);
router.post('/:userId', createAddress);

module.exports = router;
