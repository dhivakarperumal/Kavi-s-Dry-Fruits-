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
      [code, discountType, discountValue, minPurchase !== undefined && minPurchase !== '' ? minPurchase : null, expiryDate || null, usageLimit !== undefined && usageLimit !== '' ? usageLimit : null, status || 'active']
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

const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const [rows] = await db.query('SELECT * FROM coupons WHERE code = ? AND status = "active"', [code]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    const coupon = rows[0];
    
    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check min purchase
    if (subtotal < Number(coupon.minPurchase || 0)) {
      return res.status(400).json({ 
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` 
      });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCoupons, createCoupon, deleteCoupon, validateCoupon };
