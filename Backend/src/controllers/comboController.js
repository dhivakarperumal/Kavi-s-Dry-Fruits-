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

    // Component stock is not modified when adding a combo pack

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

    // Component stock is not modified when updating a combo pack
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
