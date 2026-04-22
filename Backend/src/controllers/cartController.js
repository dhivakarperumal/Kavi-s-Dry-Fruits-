const db = require('../config/db');

const getCart = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cart WHERE userId = ?', [req.params.userId]);
    res.json(rows.map(row => ({
      ...row,
      weights: JSON.parse(row.weights || '[]'),
      prices: JSON.parse(row.prices || '{}')
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, name, category, price, quantity, imageUrl, selectedWeight, weights, prices, docId } = req.body;
    
    // Check if exists
    const [existing] = await db.query('SELECT id, quantity FROM cart WHERE docId = ?', [docId]);
    
    if (existing.length > 0) {
      await db.query('UPDATE cart SET quantity = ? WHERE docId = ?', [quantity, docId]);
      res.json({ message: 'Cart updated' });
    } else {
      await db.query(
        'INSERT INTO cart (userId, productId, name, category, price, quantity, imageUrl, selectedWeight, weights, prices, docId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, productId, name, category, price, quantity, imageUrl, selectedWeight, JSON.stringify(weights), JSON.stringify(prices), docId]
      );
      res.json({ message: 'Added to cart' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { docId, quantity } = req.body;
    await db.query('UPDATE cart SET quantity = ? WHERE docId = ?', [quantity, docId]);
    res.json({ message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { userId, docId } = req.params;
    await db.query('DELETE FROM cart WHERE docId = ? AND userId = ?', [docId, userId]);
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE userId = ?', [req.params.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeCartItem,
  clearCart
};
