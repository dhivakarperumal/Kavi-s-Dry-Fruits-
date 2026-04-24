const express = require('express');
const { getSettings, updateSettings, getDistance } = require('../controllers/settingsController');
const router = express.Router();

router.get('/', getSettings);
router.post('/', updateSettings);
router.get('/distance', getDistance);

module.exports = router;
