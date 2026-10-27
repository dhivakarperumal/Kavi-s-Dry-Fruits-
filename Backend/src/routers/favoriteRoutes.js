const express = require('express');
const { getFavorites, addToFavorites, removeFavoriteItem, clearWishlist } = require('../controllers/favoriteController');
const { authenticate, authorizeSelfOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate, authorizeSelfOrAdmin());
router.get('/:userId', getFavorites);
router.post('/:userId', addToFavorites);
router.delete('/:userId/:productId', removeFavoriteItem);
router.delete('/:userId', clearWishlist);

module.exports = router;
