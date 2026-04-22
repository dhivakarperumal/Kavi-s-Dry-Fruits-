const db = require('../config/db');

const logStockHistory = async (req, res) => {
  try {
    const { productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type } = req.body;
    const [result] = await db.query(
      'INSERT INTO stock_history (productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type]
    );
    res.json({ id: result.insertId, message: 'Stock history logged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stock_history ORDER BY timestamp DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { logStockHistory, getStockHistory };
