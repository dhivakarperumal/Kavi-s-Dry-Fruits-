const express = require('express');
const { getCart, addToCart, updateQuantity, updateWeight, removeCartItem, clearCart } = require('../controllers/cartController');
const { authenticate, authorizeSelfOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate, authorizeSelfOrAdmin());
router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.post('/:userId/update-quantity', updateQuantity);
router.post('/:userId/update-weight', updateWeight);
router.delete('/:userId/:docId', removeCartItem);
router.delete('/:userId', clearCart);

module.exports = router;
