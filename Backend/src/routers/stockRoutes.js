const express = require('express');
const { logStockHistory, getStockHistory } = require('../controllers/stockController');
const router = express.Router();

router.get('/', getStockHistory);
router.post('/', logStockHistory);

module.exports = router;
