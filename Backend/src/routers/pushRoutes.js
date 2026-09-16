const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getVapidPublicKey, subscribeAdmin } = require('../controllers/pushController');

const router = express.Router();
router.get('/public-key', authenticate, requireAdmin, getVapidPublicKey);
router.post('/subscribe', authenticate, requireAdmin, subscribeAdmin);

module.exports = router;
