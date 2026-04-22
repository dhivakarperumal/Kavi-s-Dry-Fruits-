const db = require('../config/db');

const getFavorites = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM favorites WHERE userId = ?', [req.params.userId]);
    res.json(rows.map(row => ({
      ...row,
      weights: JSON.parse(row.weights || '[]'),
      prices: JSON.parse(row.prices || '{}')
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, name, price, imageUrl, selectedWeight, weights, prices } = req.body;
    await db.query(
      'INSERT INTO favorites (userId, productId, name, price, imageUrl, selectedWeight, weights, prices) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name',
      [userId, productId, name, price, imageUrl, selectedWeight, JSON.stringify(weights), JSON.stringify(prices)]
    );
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFavoriteItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await db.query('DELETE FROM favorites WHERE userId = ? AND productId = ?', [userId, productId]);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query('DELETE FROM favorites WHERE userId = ?', [userId]);
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFavoriteItem,
  clearWishlist
};
