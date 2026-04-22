const express = require('express');
const { getCart, addToCart, updateQuantity, removeCartItem, clearCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.post('/:userId/update-quantity', updateQuantity);
router.delete('/:userId/:docId', removeCartItem);
router.delete('/:userId', clearCart);

module.exports = router;
