const db = require('../config/db');

// Generate next Dealer ID
const generateDealerId = async () => {
  try {
    const [rows] = await db.query(
      `SELECT dealerId FROM dealers ORDER BY dealerId DESC LIMIT 1`
    );

    if (rows.length === 0) {
      return 'KD0001';
    } else {
      const lastId = rows[0].dealerId;
      const num = parseInt(lastId.replace('KD', ''), 10) + 1;
      return 'KD' + num.toString().padStart(4, '0');
    }
  } catch (error) {
    console.error('Error generating dealer ID:', error);
    throw error;
  }
};

// Get all dealers
exports.getDealers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dealers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new dealer
exports.addDealer = async (req, res) => {
  try {
    const { dealerName, dealerGSTNumber, dealerPhoneNumber, dealerMail, dealerAddress } = req.body;

    // Validate required fields
    if (!dealerName || !dealerPhoneNumber) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const dealerId = await generateDealerId();

    const [result] = await db.query(
      `INSERT INTO dealers (dealerId, dealerName, dealerGSTNumber, dealerPhoneNumber, dealerMail, dealerAddress) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dealerId, dealerName, dealerGSTNumber || '', dealerPhoneNumber, dealerMail || '', dealerAddress || '']
    );

    res.status(201).json({ id: result.insertId, dealerId, message: 'Dealer added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Update dealer
exports.updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { dealerName, dealerGSTNumber, dealerPhoneNumber, dealerMail, dealerAddress } = req.body;

    if (!dealerName || !dealerPhoneNumber) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const [result] = await db.query(
      `UPDATE dealers SET dealerName = ?, dealerGSTNumber = ?, dealerPhoneNumber = ?, dealerMail = ?, dealerAddress = ? 
       WHERE id = ?`,
      [dealerName, dealerGSTNumber || '', dealerPhoneNumber, dealerMail || '', dealerAddress || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    res.json({ message: 'Dealer updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Delete dealer
exports.deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM dealers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    res.json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
