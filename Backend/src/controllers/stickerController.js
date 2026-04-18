const db = require('../config/db');

// Get all products (single and combo) for sticker printing
exports.getProducts = async (req, res) => {
  try {
    const query = `
      SELECT id, productId, name, barcode, barcodeValue, 
             'Single Product' as type, 'Single Product' as productType 
      FROM products
      UNION ALL
      SELECT id, productId, name, barcode, barcodeValue, 
             'Combo Pack' as type, 'Combo Pack' as productType 
      FROM combos
      ORDER BY name ASC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save sticker printing record
exports.saveStickerRecord = async (req, res) => {
  try {
    const { productId, weight, price, barcode, packingDate, printQty, totalStickers } = req.body;

    if (!productId || !price || !barcode || !packingDate || !printQty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO sticker_records 
      (productId, weight, price, barcode, packingDate, printQty, totalStickers, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [productId, weight, price, barcode, packingDate, printQty, totalStickers]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Sticker record saved successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get sticker records
exports.getStickerRecords = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sr.*, p.name, p.productId FROM sticker_records sr 
       LEFT JOIN products p ON sr.productId = p.id 
       ORDER BY sr.createdAt DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete sticker record
exports.deleteStickerRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM sticker_records WHERE id = ?', [id]);
    res.json({ message: 'Sticker record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
