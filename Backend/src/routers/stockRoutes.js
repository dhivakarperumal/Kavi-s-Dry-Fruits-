const express = require('express');
const { logStockHistory, getStockHistory, bulkStockUpdate } = require('../controllers/stockController');
const router = express.Router();

router.get('/', getStockHistory);
router.post('/', logStockHistory);
router.post('/bulk', bulkStockUpdate);

module.exports = router;
