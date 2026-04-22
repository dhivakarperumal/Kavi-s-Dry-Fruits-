const db = require('../config/db');

const getCoupons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minPurchase, expiryDate, usageLimit, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO coupons (code, discountType, discountValue, minPurchase, expiryDate, usageLimit, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, discountType, discountValue, minPurchase, expiryDate, usageLimit, status || 'active']
    );
    res.json({ id: result.insertId, message: 'Coupon created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await db.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCoupons, createCoupon, deleteCoupon };
