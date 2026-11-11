const express = require('express');
const { getCart, addToCart, updateQuantity, updateWeight, removeCartItem, clearCart } = require('../controllers/cartController');
const { authenticate, authorizeSelfOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);
router.get('/:userId', authorizeSelfOrAdmin(), getCart);
router.post('/:userId', authorizeSelfOrAdmin(), addToCart);
router.post('/:userId/update-quantity', authorizeSelfOrAdmin(), updateQuantity);
router.post('/:userId/update-weight', authorizeSelfOrAdmin(), updateWeight);
router.delete('/:userId/:docId', authorizeSelfOrAdmin(), removeCartItem);
router.delete('/:userId', authorizeSelfOrAdmin(), clearCart);

module.exports = router;
