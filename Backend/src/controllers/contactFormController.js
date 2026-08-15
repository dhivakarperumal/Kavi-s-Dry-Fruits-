const db = require('../config/db');
const crypto = require('crypto');

const createSubmissionId = () => 'CF-' + crypto.randomBytes(4).toString('hex').toUpperCase();

exports.getContactSubmissions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createContactSubmission = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      contact,
      message,
      address,
      subject,
      source = 'website'
    } = req.body;

    const finalName = (name || '').trim() || 'Customer';
    const finalEmail = (email || '').trim();
    const finalPhone = (phone || contact || '').trim();
    const finalAddress = (address || '').trim();
    const finalMessage = (message || '').trim() || 'No message provided';
    const finalSubject = (subject || '').trim() || 'Contact Form Submission';

    if (!finalEmail && !finalPhone) {
      return res.status(400).json({ message: 'Email or phone is required.' });
    }

    const submissionId = createSubmissionId();

    const [result] = await db.query(
      `INSERT INTO contact_submissions
        (submissionId, name, email, phone, address, message, subject, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        finalName,
        finalEmail,
        finalPhone,
        finalAddress,
        finalMessage,
        finalSubject,
        source
      ]
    );

    res.status(201).json({
      id: result.insertId,
      submissionId,
      message: 'Submission saved successfully.'
    });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
