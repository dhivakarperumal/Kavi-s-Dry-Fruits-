const express = require('express');
const router = express.Router();
const stickerController = require('../controllers/stickerController');

router.get('/products', stickerController.getProducts);
router.post('/', stickerController.saveStickerRecord);
router.get('/', stickerController.getStickerRecords);
router.delete('/:id', stickerController.deleteStickerRecord);

module.exports = router;
