const express = require('express');
const { getCoupons, createCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const router = express.Router();

router.get('/', getCoupons);
router.post('/', createCoupon);
router.post('/validate', validateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
