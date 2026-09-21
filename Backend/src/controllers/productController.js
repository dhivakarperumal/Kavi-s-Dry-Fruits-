const db = require('../config/db');

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch (_error) { return fallback; }
};
const uploadedImages = (req) => (req.files || []).map(file => `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`);
const normalizeWeight = (value) => {
  const raw = String(value ?? '').trim().toLowerCase().replace(/,/g, '');
  const amount = parseFloat(raw);
  if (!Number.isFinite(amount)) return 0;
  return amount * 1000;
};

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map(row => ({
      ...row,
      images: parseJson(row.images, []),
      variants: parseJson(row.variants, []),
      healthBenefits: parseJson(row.healthBenefits, []),
      comboItems: parseJson(row.comboItems, []),
      comboDetails: parseJson(row.comboDetails, {}),
    }));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, variants, totalWeight, totalStock, status
    } = req.body;
    const normalizedTotalWeight = normalizeWeight(totalWeight);
    const requestedStock = Number(totalStock);
    const storedTotalStock = Number.isFinite(requestedStock) && requestedStock > 0
      ? requestedStock
      : normalizedTotalWeight;

    const [result] = await db.query(
      `INSERT INTO products 
      (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, variants, totalStock, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId, name, description, 
        JSON.stringify(parseJson(healthBenefits, [])),
        category, rating, barcode, barcodeValue,
        JSON.stringify([...parseJson(images, []), ...uploadedImages(req)]),
        JSON.stringify(parseJson(variants, [])),
        storedTotalStock,
        status || 'Active'
      ]
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('productAdded', {
        productId,
        name,
        category,
        createdAt: new Date()
      });
    }

    res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productId, name, description, healthBenefits, category, rating, barcode, barcodeValue,
      images, variants, totalWeight, totalStock, status
    } = req.body;
    const normalizedTotalWeight = normalizeWeight(totalWeight);
    const [existingRows] = await db.query('SELECT totalStock FROM products WHERE id = ?', [id]);
    const existingStock = existingRows.length > 0 ? Number(existingRows[0].totalStock || 0) : 0;
    const requestedStock = Number(totalStock);
    const parsedWeight = Number(totalWeight);
    const hasWeight = totalWeight !== undefined && totalWeight !== null && String(totalWeight).trim() !== '' && Number.isFinite(parsedWeight) && parsedWeight >= 0;
    const storedTotalStock = hasWeight
      ? normalizedTotalWeight
      : Number.isFinite(requestedStock) && requestedStock >= 0
        ? requestedStock
        : existingStock;

    await db.query(
      `UPDATE products SET 
      productId = ?, name = ?, description = ?, healthBenefits = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, 
      images = ?, variants = ?, totalStock = ?, status = ? 
      WHERE id = ?`,
      [
        productId, name, description, 
        JSON.stringify(parseJson(healthBenefits, [])),
        category, rating, barcode, barcodeValue,
        JSON.stringify([...parseJson(images, []), ...uploadedImages(req)]),
        JSON.stringify(parseJson(variants, [])),
        storedTotalStock,
        status || 'Active',
        id
      ]
    );

    const io = req.app.get('io');
    if (io && Number(storedTotalStock) <= 500) {
      io.emit('lowStockAlert', {
        productId,
        name,
        remainingStock: Number(storedTotalStock || 0),
        category: category || 'Product',
        isOutOfStock: Number(storedTotalStock || 0) <= 0,
        createdAt: new Date()
      });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
