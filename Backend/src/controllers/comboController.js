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
  try {
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, comboItems, comboDetails, totalStock
    } = req.body;

    const [result] = await db.query(
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

    res.status(201).json({ id: result.insertId, message: 'Combo pack added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, comboItems, comboDetails, totalStock
    } = req.body;

    await db.query(
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

    res.json({ message: 'Combo pack updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
