const express = require('express');
const router = express.Router();
const comboController = require('../controllers/comboController');
const reviewController = require('../controllers/reviewController');

router.get('/', comboController.getCombos);
router.post('/', comboController.addCombo);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;
