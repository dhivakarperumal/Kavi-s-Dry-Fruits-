const express = require('express');
const { getHealthBenefits, createHealthBenefit, updateHealthBenefit, deleteHealthBenefit } = require('../controllers/healthController');
const router = express.Router();

router.get('/', getHealthBenefits);
router.post('/', createHealthBenefit);
router.put('/:id', updateHealthBenefit);
router.delete('/:id', deleteHealthBenefit);

module.exports = router;
