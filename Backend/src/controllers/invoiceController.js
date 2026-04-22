const db = require('../config/db');

const getInvoices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName } = req.body;
    const [result] = await db.query(
      'INSERT INTO invoices (invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName]
    );
    res.json({ id: result.insertId, message: 'Invoice created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getInvoices, createInvoice };
