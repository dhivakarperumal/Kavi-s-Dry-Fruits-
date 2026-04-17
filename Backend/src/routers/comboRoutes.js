const express = require('express');
const router = express.Router();
const comboController = require('../controllers/comboController');

router.get('/', comboController.getCombos);
router.post('/', comboController.addCombo);
router.put('/:id', comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;
