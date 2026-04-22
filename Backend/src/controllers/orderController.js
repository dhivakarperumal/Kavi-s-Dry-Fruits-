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
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      orderId, userId, clientName, clientPhone, clientGST, email, 
      shippingAddress, customerType, paymentMode, paymentStatus, 
      paymentId, orderStatus, shippingCharge, items, gstAmount, totalAmount 
    } = req.body;

    // 1. Insert Order
    const [result] = await connection.query(
      'INSERT INTO orders (orderId, userId, clientName, clientPhone, clientGST, email, shippingAddress, customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, items, gstAmount, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, userId, clientName, clientPhone, clientGST, email, JSON.stringify(shippingAddress), customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, JSON.stringify(items), gstAmount, totalAmount]
    );

    // 2. Reduce Stock
    const parsedItems = Array.isArray(items) ? items : JSON.parse(items || '[]');
    
    for (const item of parsedItems) {
      const qty = parseInt(item.qty || item.quantity || 1, 10);
      const isCombo = item.category === "Combo" || item.type === "combo";
      const table = isCombo ? 'combos' : 'products';
      
      // Get current stock and details
      const [rows] = await connection.query(`SELECT id, totalStock, comboDetails, comboItems FROM ${table} WHERE id = ?`, [item.id]);
      
      if (rows.length > 0) {
        const productData = rows[0];
        let currentStock = Number(productData.totalStock || 0);
        let weightToSubtract = 0;

        if (isCombo) {
          // A. Reduce Combo Stock itself
          const details = typeof productData.comboDetails === 'string' ? JSON.parse(productData.comboDetails || '{}') : (productData.comboDetails || {});
          const comboWeight = Number(details.totalWeight || 0);
          weightToSubtract = qty * comboWeight;

          // B. Reduce Individual Items stock inside the Combo
          const comboItems = typeof productData.comboItems === 'string' ? JSON.parse(productData.comboItems || '[]') : (productData.comboItems || []);
          for (const subItem of comboItems) {
            if (subItem.name) {
              // Parse weight of sub-item (handle formats like "500g" or "(500g)")
              const subWeightStr = String(subItem.weight || "").replace(/[()]/g, "").toLowerCase();
              let subWeightPerUnit = parseFloat(subWeightStr) || 0;
              if (subWeightStr.includes("kg") || subWeightStr.includes("k")) {
                subWeightPerUnit *= 1000;
              }
              const subTotalToSubtract = qty * subWeightPerUnit;

              // Find and update product by name (Trimmed search for resilience)
              const [prodRows] = await connection.query(`SELECT id, totalStock FROM products WHERE TRIM(name) = TRIM(?)`, [subItem.name]);
              if (prodRows.length > 0) {
                const subProd = prodRows[0];
                const subNewStock = Math.max(Number(subProd.totalStock || 0) - subTotalToSubtract, 0);
                await connection.query(`UPDATE products SET totalStock = ? WHERE id = ?`, [String(subNewStock), subProd.id]);
                console.log(`[Stock-ComboItem] Reduced product '${subItem.name.trim()}' by ${subTotalToSubtract}g. New stock: ${subNewStock}g`);
              }
            }
          }
        } else {
          // For single products, we parse the selected weight (e.g. "500g" or "1kg")
          const weightStr = String(item.selectedWeight || "").toLowerCase();
          let weightPerUnit = parseFloat(weightStr) || 0;
          if (weightStr.includes("kg") || weightStr.includes("k")) {
            weightPerUnit *= 1000;
          }
          weightToSubtract = qty * weightPerUnit;
        }

        const newStock = Math.max(currentStock - weightToSubtract, 0);
        await connection.query(`UPDATE ${table} SET totalStock = ? WHERE id = ?`, [String(newStock), item.id]);
        console.log(`[Stock] Reduced ${table} ID ${item.id} by ${weightToSubtract}g. New stock: ${newStock}g`);
      }
    }

    await connection.commit();
    res.json({ id: result.insertId, message: 'Order created and stock updated' });
  } catch (error) {
    await connection.rollback();
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
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
