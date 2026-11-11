const express = require('express');
const { getFavorites, addToFavorites, removeFavoriteItem, clearWishlist } = require('../controllers/favoriteController');
const { authenticate, authorizeSelfOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);
router.get('/:userId', authorizeSelfOrAdmin(), getFavorites);
router.post('/:userId', authorizeSelfOrAdmin(), addToFavorites);
router.delete('/:userId/:productId', authorizeSelfOrAdmin(), removeFavoriteItem);
router.delete('/:userId', authorizeSelfOrAdmin(), clearWishlist);

module.exports = router;
