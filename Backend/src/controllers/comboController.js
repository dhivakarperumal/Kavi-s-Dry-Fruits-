const db = require('../config/db');

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch (_error) { return fallback; }
};
const uploadedImages = (req) => (req.files || []).map(file => `${req.protocol}://${req.get('host')}/uploads/combos/${file.filename}`);
const normalizeWeight = (value) => {
  const raw = String(value ?? '').trim().toLowerCase().replace(/,/g, '');
  const amount = parseFloat(raw);
  if (!Number.isFinite(amount)) return 0;
  return amount * 1000;
};

exports.getCombos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM combos ORDER BY created_at DESC');
    const combos = rows.map(row => ({
      ...row,
      images: parseJson(row.images, []),
      comboItems: parseJson(row.comboItems, []),
      healthBenefits: parseJson(row.healthBenefits, []),
      comboDetails: parseJson(row.comboDetails, {}),
    }));
    res.json(combos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCombo = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, comboItems, comboDetails, totalStock, status
    } = req.body;
    const parsedComboItems = parseJson(comboItems, []);
    const parsedComboDetails = parseJson(comboDetails, {});
    parsedComboDetails.totalWeight = normalizeWeight(parsedComboDetails.totalWeight);

    // Validate constituent products stock before inserting/reducing
    const addedStockPC = Number(totalStock || 0);
    if (addedStockPC > 0 && parsedComboItems.length > 0) {
      const requiredGramsPerProduct = {};
      for (const item of parsedComboItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          const key = item.name.trim();
          requiredGramsPerProduct[key] = (requiredGramsPerProduct[key] || 0) + (addedStockPC * itemWeight);
        }
      }

      for (const [prodName, neededGrams] of Object.entries(requiredGramsPerProduct)) {
        const [prodRows] = await connection.query(
          `SELECT id, name, totalStock FROM products WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) FOR UPDATE`,
          [prodName]
        );
        if (prodRows.length > 0) {
          const currentStock = Number(prodRows[0].totalStock || 0);
          if (currentStock < neededGrams) {
            await connection.rollback();
            return res.status(400).json({
              message: `Insufficient stock for "${prodRows[0].name}". Required: ${neededGrams}g (${addedStockPC} PC), but only ${currentStock}g is available.`
            });
          }
        }
      }
    }

    const [result] = await connection.query(
      `INSERT INTO combos 
      (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, comboItems, comboDetails, totalStock, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId, name, description, 
        JSON.stringify(parseJson(healthBenefits, [])),
        category, rating, barcode, barcodeValue,
        JSON.stringify([...parseJson(images, []), ...uploadedImages(req)]),
        JSON.stringify(parseJson(comboItems, [])),
        JSON.stringify(parsedComboDetails),
        totalStock || 0,
        status || 'Active'
      ]
    );

    // Reduce constituent products stock based on PC
    if (addedStockPC > 0 && parsedComboItems.length > 0) {
      for (const item of parsedComboItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          
          const reductionAmount = addedStockPC * itemWeight;

          const [res] = await connection.query(
            `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))`, 
            [reductionAmount, item.name]
          );
          if (res.affectedRows > 0) {
            console.log(`[Admin-AddCombo] Atomic reduction for '${item.name.trim()}': -${reductionAmount}g`);
          }
        }
      }
    }

    await connection.commit();
    res.status(201).json({ id: result.insertId, message: 'Combo pack added successfully' });
  } catch (error) {
    try { await connection.rollback(); } catch (rbErr) { console.error('Rollback failed:', rbErr.message); }
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  } finally {
    connection.release();
  }
};

exports.updateCombo = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, comboItems, comboDetails, totalStock, status
    } = req.body;
    const parsedComboItems = parseJson(comboItems, []);
    const parsedComboDetails = parseJson(comboDetails, {});
    parsedComboDetails.totalWeight = normalizeWeight(parsedComboDetails.totalWeight);

    // Get old stock to calculate delta
    const [oldRows] = await connection.query(`SELECT totalStock FROM combos WHERE id = ?`, [id]);
    const oldStock = oldRows.length > 0 ? Number(oldRows[0].totalStock || 0) : 0;
    const requestedStock = Number(totalStock);
    const newStock = Number.isFinite(requestedStock) && requestedStock >= 0 ? requestedStock : oldStock;
    const delta = newStock - oldStock;

    // If stock increased, validate that sufficient stock exists for delta
    if (delta > 0 && parsedComboItems.length > 0) {
      const numUnitsDelta = delta;
      const requiredDeltaPerProduct = {};
      for (const item of parsedComboItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          const key = item.name.trim();
          requiredDeltaPerProduct[key] = (requiredDeltaPerProduct[key] || 0) + (numUnitsDelta * itemWeight);
        }
      }

      for (const [prodName, neededGrams] of Object.entries(requiredDeltaPerProduct)) {
        const [prodRows] = await connection.query(
          `SELECT id, name, totalStock FROM products WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) FOR UPDATE`,
          [prodName]
        );
        if (prodRows.length > 0) {
          const currentStock = Number(prodRows[0].totalStock || 0);
          if (currentStock < neededGrams) {
            await connection.rollback();
            return res.status(400).json({
              message: `Insufficient stock for "${prodRows[0].name}". Additional ${neededGrams}g required (+${numUnitsDelta} PC), but only ${currentStock}g is available.`
            });
          }
        }
      }
    }

    await connection.query(
      `UPDATE combos SET 
      productId = ?, name = ?, description = ?, healthBenefits = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, 
      images = ?, comboItems = ?, comboDetails = ?, totalStock = ?, status = ? 
      WHERE id = ?`,
      [
        productId, name, description, 
        JSON.stringify(parseJson(healthBenefits, [])),
        category, rating, barcode, barcodeValue,
        JSON.stringify([...parseJson(images, []), ...uploadedImages(req)]),
        JSON.stringify(parsedComboItems),
        JSON.stringify(parsedComboDetails),
        newStock,
        status || 'Active',
        id
      ]
    );

    // If stock increased, reduce components based on PC delta
    if (delta > 0 && parsedComboItems.length > 0) {
      const numUnitsDelta = delta;

      // SORT to prevent deadlocks
      const sortedItems = [...parsedComboItems].sort((a, b) => String(a.name).localeCompare(String(b.name)));

      for (const item of sortedItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          
          const reductionAmount = numUnitsDelta * itemWeight;

          await connection.query(
            `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))`, 
            [reductionAmount, item.name]
          );
          console.log(`[Admin-UpdateCombo] Sub-item '${item.name}': -${reductionAmount}g`);
        }
      }
    }
    await connection.commit();
    res.json({ message: 'Combo pack updated successfully' });
  } catch (error) {
    try { await connection.rollback(); } catch (rbErr) { console.error('Rollback failed:', rbErr.message); }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM combos WHERE id = ?', [id]);
    res.json({ message: 'Combo pack deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
