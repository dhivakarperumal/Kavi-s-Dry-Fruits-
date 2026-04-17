const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealerController');

router.get('/', dealerController.getDealers);
router.post('/', dealerController.addDealer);
router.put('/:id', dealerController.updateDealer);
router.delete('/:id', dealerController.deleteDealer);

module.exports = router;
