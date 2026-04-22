const db = require('../config/db');

const getAddresses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, contact, zip, city, state, street, country } = req.body;
    const [result] = await db.query(
      'INSERT INTO user_addresses (user_id, fullname, email, contact, zip, city, state, street, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, fullname, email, contact, zip, city, state, street, country]
    );
    res.json({ id: result.insertId, message: 'Address saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAddresses, createAddress };
