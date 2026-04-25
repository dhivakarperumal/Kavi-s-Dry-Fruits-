const db = require('../config/db');

exports.getCombos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM combos ORDER BY created_at DESC');
    const combos = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      comboItems: JSON.parse(row.comboItems || '[]'),
      healthBenefits: JSON.parse(row.healthBenefits || '[]'),
      comboDetails: JSON.parse(row.comboDetails || '{}'),
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
      images, comboItems, comboDetails, totalStock
    } = req.body;

    const [result] = await connection.query(
      `INSERT INTO combos 
      (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, comboItems, comboDetails, totalStock) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId, name, description, 
        JSON.stringify(healthBenefits || []),
        category, rating, barcode, barcodeValue,
        JSON.stringify(images || []),
        JSON.stringify(comboItems || []),
        JSON.stringify(comboDetails || {}),
        totalStock || 0
      ]
    );

    // Reduce constituent products stock
    const addedStock = Number(totalStock || 0);
    if (addedStock > 0 && comboItems && comboItems.length > 0) {
      const details = typeof comboDetails === 'string' ? JSON.parse(comboDetails || '{}') : (comboDetails || {});
      const totalWeight = Number(details.totalWeight || 1); // avoid division by zero

      for (const item of comboItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          
          // Calculate how much to reduce from bulk product
          const reductionAmount = (addedStock / totalWeight) * itemWeight;

          const [res] = await connection.query(
            `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE TRIM(name) = TRIM(?)`, 
            [reductionAmount, item.name]
          );
          if (res.affectedRows > 0) {
            console.log(`[Admin-AddCombo] Atomic reduction for '${item.name.trim()}': -${reductionAmount}g`);
          }
        }
      }
    }

    await connection.commit();
    res.status(201).json({ id: result.insertId, message: 'Combo pack added and component stock reduced' });
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
      images, comboItems, comboDetails, totalStock
    } = req.body;

    // Get old stock to calculate delta
    const [oldRows] = await connection.query(`SELECT totalStock FROM combos WHERE id = ?`, [id]);
    const oldStock = oldRows.length > 0 ? Number(oldRows[0].totalStock || 0) : 0;
    const newStock = Number(totalStock || 0);
    const delta = newStock - oldStock;

    await connection.query(
      `UPDATE combos SET 
      productId = ?, name = ?, description = ?, healthBenefits = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, 
      images = ?, comboItems = ?, comboDetails = ?, totalStock = ? 
      WHERE id = ?`,
      [
        productId, name, description, 
        JSON.stringify(healthBenefits || []),
        category, rating, barcode, barcodeValue,
        JSON.stringify(images || []),
        JSON.stringify(comboItems || []),
        JSON.stringify(comboDetails || {}),
        totalStock || 0,
        id
      ]
    );

    // If stock increased, reduce components
    if (delta > 0 && comboItems && comboItems.length > 0) {
      const details = typeof comboDetails === 'string' ? JSON.parse(comboDetails || '{}') : (comboDetails || {});
      
      // Calculate real total weight from items if missing or set to 1
      let calculatedTotalWeight = comboItems.reduce((sum, ci) => {
        const wStr = String(ci.weight || "").toLowerCase();
        let w = parseFloat(wStr) || 0;
        if (wStr.includes("kg") || wStr.includes("k")) w *= 1000;
        return sum + w;
      }, 0);

      const totalWeight = Number(details.totalWeight) || calculatedTotalWeight || 1;
      const numUnitsDelta = delta / totalWeight;

      // SORT to prevent deadlocks
      const sortedItems = [...comboItems].sort((a, b) => String(a.name).localeCompare(String(b.name)));

      for (const item of sortedItems) {
        if (item.name && item.weight) {
          const itemWeightStr = String(item.weight).replace(/[()]/g, "").toLowerCase();
          let itemWeight = parseFloat(itemWeightStr) || 0;
          if (itemWeightStr.includes("kg") || itemWeightStr.includes("k")) itemWeight *= 1000;
          
          const reductionAmount = numUnitsDelta * itemWeight;

          await connection.query(
            `UPDATE products SET totalStock = GREATEST(CAST(totalStock AS SIGNED) - ?, 0) WHERE TRIM(name) = TRIM(?)`, 
            [reductionAmount, item.name]
          );
          console.log(`[Admin-UpdateCombo] Sub-item '${item.name}': -${reductionAmount}g`);
        }
      }
    }

    await connection.commit();
    res.json({ message: 'Combo pack updated and component stock adjusted' });
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
