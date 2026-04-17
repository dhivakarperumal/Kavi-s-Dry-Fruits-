const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      variants: JSON.parse(row.variants || '[]'),
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
      productId, name, description, category, rating, barcode, barcodeValue,
      productType, images, variants, comboItems, comboDetails, totalStock
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO products 
      (productId, name, description, category, rating, barcode, barcodeValue, productType, images, variants, comboItems, comboDetails, totalStock) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId, name, description, category, rating, barcode, barcodeValue, productType,
        JSON.stringify(images || []),
        JSON.stringify(variants || []),
        JSON.stringify(comboItems || []),
        JSON.stringify(comboDetails || {}),
        totalStock || 0
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Product added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productId, name, description, category, rating, barcode, barcodeValue,
      productType, images, variants, comboItems, comboDetails, totalStock
    } = req.body;

    await db.query(
      `UPDATE products SET 
      productId = ?, name = ?, description = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, 
      productType = ?, images = ?, variants = ?, comboItems = ?, comboDetails = ?, totalStock = ? 
      WHERE id = ?`,
      [
        productId, name, description, category, rating, barcode, barcodeValue, productType,
        JSON.stringify(images || []),
        JSON.stringify(variants || []),
        JSON.stringify(comboItems || []),
        JSON.stringify(comboDetails || {}),
        totalStock || 0,
        id
      ]
    );


    res.json({ message: 'Product updated' });
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
