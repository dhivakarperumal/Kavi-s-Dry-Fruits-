const db = require('../config/db');

const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    const parsedRows = rows.map(row => ({
      ...row,
      shippingAddress: JSON.parse(row.shippingAddress || '{}'),
      items: JSON.parse(row.items || '[]'),
      cartItems: JSON.parse(row.items || '[]') // compatibility fallback
    }));
    res.json(parsedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { orderId, userId, clientName, clientPhone, clientGST, email, shippingAddress, customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, items, gstAmount, totalAmount } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (orderId, userId, clientName, clientPhone, clientGST, email, shippingAddress, customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, items, gstAmount, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, userId, clientName, clientPhone, clientGST, email, JSON.stringify(shippingAddress), customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, JSON.stringify(items), gstAmount, totalAmount]
    );
    res.json({ id: result.insertId, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    await db.query('UPDATE orders SET orderStatus = ? WHERE id = ?', [orderStatus, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE userId = ? ORDER BY created_at DESC', [userId]);
    res.json(rows.map(row => ({
      ...row,
      shippingAddress: JSON.parse(row.shippingAddress || '{}'),
      items: JSON.parse(row.items || '[]'),
      cartItems: JSON.parse(row.items || '[]'),
      date: row.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrder, deleteOrder, getUserOrders };
