const express = require('express');
const { getCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const router = express.Router();

router.get('/', getCoupons);
router.post('/', createCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
