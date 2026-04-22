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

const bulkStockUpdate = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { items, invoiceNumber } = req.body;
    
    for (const item of items) {
      const isCombo = item.type === 'combo';
      const table = isCombo ? 'combos' : 'products';
      const addedGrams = Number(item.addedQuantity) * 1000;
      
      // Get current stock
      const [rows] = await connection.query(`SELECT id, totalStock, name, category FROM ${table} WHERE productId = ?`, [item.productId]);
      if (rows.length === 0) continue; // Skip items not found
      
      const prodData = rows[0];
      const finalStock = (Number(prodData.totalStock) || 0) + addedGrams;
      
      // Atomic Update
      await connection.query(`UPDATE ${table} SET totalStock = ?, lastInvoice = ? WHERE id = ?`, [String(finalStock), invoiceNumber, prodData.id]);
      
      // Log history
      await connection.query(
        'INSERT INTO stock_history (productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.productId, prodData.name, prodData.category, addedGrams, finalStock, invoiceNumber, item.type]
      );
    }
    
    await connection.commit();
    res.json({ message: 'Bulk update processed' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

module.exports = { logStockHistory, getStockHistory, bulkStockUpdate };
