const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      variants: JSON.parse(row.variants || '[]'),
      healthBenefits: JSON.parse(row.healthBenefits || '[]'),
      comboItems: JSON.parse(row.comboItems || '[]'),
      comboDetails: JSON.parse(row.comboDetails || '{}'),
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
      images, variants, totalStock, status
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO products 
      (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, variants, totalStock, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId, name, description, 
        JSON.stringify(healthBenefits || []),
        category, rating, barcode, barcodeValue,
        JSON.stringify(images || []),
        JSON.stringify(variants || []),
        totalStock || 0,
        status || 'Active'
      ]
    );

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
      images, variants, totalStock, status
    } = req.body;

    await db.query(
      `UPDATE products SET 
      productId = ?, name = ?, description = ?, healthBenefits = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, 
      images = ?, variants = ?, totalStock = ?, status = ? 
      WHERE id = ?`,
      [
        productId, name, description, 
        JSON.stringify(healthBenefits || []),
        category, rating, barcode, barcodeValue,
        JSON.stringify(images || []),
        JSON.stringify(variants || []),
        totalStock || 0,
        status || 'Active',
        id
      ]
    );

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
