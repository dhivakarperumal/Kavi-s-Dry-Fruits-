const db = require('../config/db');

const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    const parsedRows = rows.map(row => ({
      ...row,
      shippingAddress: typeof row.shippingAddress === 'string' ? JSON.parse(row.shippingAddress || '{}') : row.shippingAddress,
      items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items,
      cartItems: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items
    }));
    res.json(parsedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    
    const row = rows[0];
    const order = {
      ...row,
      shippingAddress: typeof row.shippingAddress === 'string' ? JSON.parse(row.shippingAddress || '{}') : row.shippingAddress,
      items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items,
    };
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const orderId = req.body.orderId || null;
    const userId = req.body.userId || null;
    const clientName = req.body.clientName || null;
    const clientPhone = req.body.clientPhone || null;
    const clientGST = req.body.clientGST || null;
    const email = req.body.email || null;
    const shippingAddress = req.body.shippingAddress || {};
    const area = req.body.area || null;
    const pincode = req.body.pincode || null;
    const lat = req.body.lat !== undefined ? req.body.lat : null;
    const lng = req.body.lng !== undefined ? req.body.lng : null;
    const distance = req.body.distance !== undefined ? req.body.distance : null;
    const delivery_charge = req.body.delivery_charge !== undefined ? req.body.delivery_charge : 0;
    const delivery_days = req.body.delivery_days !== undefined ? req.body.delivery_days : 0;
    const customerType = req.body.customerType || null;
    const paymentMode = req.body.paymentMode || null;
    const paymentStatus = req.body.paymentStatus || null;
    const paymentId = req.body.paymentId || null;
    const orderStatus = req.body.orderStatus || 'Order Placed';
    const shippingCharge = req.body.shippingCharge !== undefined ? req.body.shippingCharge : 0;
    const items = req.body.items || [];
    const gstAmount = req.body.gstAmount !== undefined ? req.body.gstAmount : 0;
    const totalAmount = req.body.totalAmount !== undefined ? req.body.totalAmount : 0;

    // 1. Insert Order
    const [result] = await connection.query(
      'INSERT INTO orders (orderId, userId, clientName, clientPhone, clientGST, email, shippingAddress, area, pincode, lat, lng, distance, delivery_charge, delivery_days, customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, items, gstAmount, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, userId, clientName, clientPhone, clientGST, email, JSON.stringify(shippingAddress), area, pincode, lat, lng, distance, delivery_charge, delivery_days, customerType, paymentMode, paymentStatus, paymentId, orderStatus, shippingCharge, JSON.stringify(items), gstAmount, totalAmount]
    );

    // 2. Insert Order Items
    const parsedItems = Array.isArray(items) ? items : JSON.parse(items || '[]');
    for (const item of parsedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, name, image, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id || item.productId, item.name, item.image || item.images?.[0] || '', item.qty || item.quantity, item.price]
      );
    }

    // 3. Insert Initial Tracking
    await connection.query(
      'INSERT INTO order_tracking (order_id, status) VALUES (?, ?)',
      [orderId, 'Order Placed']
    );

    // 4. Reduce Stock
    for (const item of parsedItems) {
      const qty = parseInt(item.qty || item.quantity || 1, 10);
      const isCombo = (item.type === "combo") || (item.category || "").toLowerCase().includes("combo") || String(item.productId || item.id || "").startsWith("KPR");
      const table = isCombo ? 'combos' : 'products';
      
      const columns = isCombo ? 'productId, id, totalStock, comboDetails, comboItems' : 'productId, id, totalStock';
      const [rows] = await connection.query(
        `SELECT ${columns} FROM ${table} WHERE TRIM(productId) = TRIM(?) OR id = ?`, 
        [item.productId || item.id, item.id]
      );
      
      console.log(`[Stock-Check] Searching ${table} for ID: ${item.productId || item.id}. Found: ${rows.length} rows.`);
      
      if (rows.length > 0) {
        const productData = rows[0];
        let weightToSubtract = 0;

        if (isCombo) {
          const details = typeof productData.comboDetails === 'string' ? JSON.parse(productData.comboDetails || '{}') : (productData.comboDetails || {});
          const comboItems = typeof productData.comboItems === 'string' ? JSON.parse(productData.comboItems || '[]') : (productData.comboItems || []);
          
          let comboWeight = Number(details.totalWeight || 0);
          
          // FALLBACK: If totalWeight is missing in details, calculate it from comboItems
          if (comboWeight <= 0) {
            console.log(`[Stock-Warn] comboWeight missing for ${productData.productId}, calculating from items...`);
            comboWeight = comboItems.reduce((sum, item) => {
              const wStr = String(item.weight || "").toLowerCase();
              let wVal = parseFloat(wStr) || 0;
              if (wStr.includes("kg") || wStr.includes("k")) wVal *= 1000;
              return sum + wVal;
            }, 0);
          }

          weightToSubtract = qty * comboWeight;
          console.log(`[Stock-Check] Combo ${productData.productId} weight per unit: ${comboWeight}g. Qty: ${qty}. Total to subtract: ${weightToSubtract}g`);

          for (const subItem of comboItems) {
            if (subItem.name) {
              const subWeightStr = String(subItem.weight || "").replace(/[()]/g, "").toLowerCase();
              let subWeightPerUnit = parseFloat(subWeightStr) || 0;
              if (subWeightStr.includes("kg") || subWeightStr.includes("k")) {
                subWeightPerUnit *= 1000;
              }
              const subTotalToSubtract = qty * subWeightPerUnit;

              // Reduce constituent products stock by weight
              console.log(`[Stock-Reduce] Combo Sub-Item: ${subItem.name}, Reduction: ${subTotalToSubtract}g`);
              await connection.query(
                `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))`, 
                [subTotalToSubtract, subItem.name]
              );
            }
          }
          // For combos, we subtract the total weight (grams) from the combo table
          console.log(`[Stock-Reduce] Combo: ${productData.productId}, Total weight reduction: ${weightToSubtract}g`);
          await connection.query(
            `UPDATE combos SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE productId = ? OR id = ?`, 
            [weightToSubtract, productData.productId, productData.id]
          );
        } else {
          // For single products, we subtract the weight
          // Support both 'weight' and 'selectedWeight' names from frontend
          const weightStr = String(item.weight || item.selectedWeight || "").toLowerCase();
          let weightPerUnit = parseFloat(weightStr) || 0;
          if (weightStr.includes("kg") || weightStr.includes("k")) {
            weightPerUnit *= 1000;
          }
          const weightToSubtract = qty * weightPerUnit;
          
          console.log(`[Stock-Reduce] Product: ${productData.productId}, Qty: ${qty}, Weight/Unit: ${weightPerUnit}g, Total: ${weightToSubtract}g`);
          
          await connection.query(
            `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE productId = ? OR id = ?`, 
            [weightToSubtract, productData.productId, productData.id]
          );
        }
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
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { orderStatus } = req.body;
    const { id } = req.params;

    // Get orderId first
    const [orders] = await connection.query('SELECT orderId FROM orders WHERE id = ?', [id]);
    if (orders.length > 0) {
      const orderId = orders[0].orderId;
      await connection.query('UPDATE orders SET orderStatus = ? WHERE id = ?', [orderStatus, id]);
      await connection.query('INSERT INTO order_tracking (order_id, status) VALUES (?, ?)', [orderId, orderStatus]);
    }

    await connection.commit();
    res.json({ message: 'Order updated' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
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
      shippingAddress: typeof row.shippingAddress === 'string' ? JSON.parse(row.shippingAddress || '{}') : row.shippingAddress,
      items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items,
      cartItems: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items,
      date: row.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderTracking = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order_tracking WHERE order_id = ? ORDER BY updated_at ASC', [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { orderId, agentId, lat, lng } = req.body;
    await db.query(
      'INSERT INTO delivery_locations (order_id, agent_id, lat, lng) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE lat = VALUES(lat), lng = VALUES(lng)',
      [orderId, agentId, lat, lng]
    );
    res.json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderLocation = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT dl.*, da.name as agentName, da.phone as agentPhone FROM delivery_locations dl LEFT JOIN delivery_agents da ON dl.agent_id = da.id WHERE dl.order_id = ? ORDER BY dl.updated_at DESC LIMIT 1',
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getOrders, 
  getOrderById,
  createOrder, 
  updateOrder, 
  deleteOrder, 
  getUserOrders, 
  getOrderTracking, 
  updateLocation, 
  getOrderLocation 
};
