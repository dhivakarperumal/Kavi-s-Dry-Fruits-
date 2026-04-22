const express = require('express');
const { getFavorites, addToFavorites, removeFavoriteItem, clearWishlist } = require('../controllers/favoriteController');
const router = express.Router();

router.get('/:userId', getFavorites);
router.post('/:userId', addToFavorites);
router.delete('/:userId/:productId', removeFavoriteItem);
router.delete('/:userId', clearWishlist);

module.exports = router;
