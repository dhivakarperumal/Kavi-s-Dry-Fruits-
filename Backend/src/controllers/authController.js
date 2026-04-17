const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/db');

const createUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const register = async (req, res) => {
  const { firstName, email, phone, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'firstName, email, and password are required.',
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';

    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userUuid = createUuid();
    const [result] = await db.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userUuid, firstName.trim(), normalizedEmail, normalizedPhone, passwordHash, 'User']
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      userId: result.insertId,
      user_id: userUuid,
      userUuid,
      username: firstName.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
    });
  } catch (error) {
    console.error('Auth register error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateField = error.sqlMessage.includes('email') ? 'Email' : 'User ID';
      return res.status(409).json({
        success: false,
        message: `${duplicateField} already exists. Please use a different value.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to register user.',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    const [users] = await db.query('SELECT id, user_id, username, email, phone, password_hash, role FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      userId: user.id,
      user_id: user.user_id,
      userUuid: user.user_id,
      username: user.username,
      firstName: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to log in.',
    });
  }
};

const googleLogin = async (req, res) => {
  const { firstName, lastName, username, email, googleId, provider } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      // Create new user
      const userUuid = createUuid();
      const fullName = `${firstName} ${lastName}`.trim();
      const [result] = await db.query(
        'INSERT INTO users (user_id, username, email, role, provider, google_id) VALUES (?, ?, ?, ?, ?, ?)',
        [userUuid, fullName || username, normalizedEmail, 'User', provider || 'google', googleId]
      );
      user = {
        id: result.insertId,
        user_id: userUuid,
        username: fullName || username,
        email: normalizedEmail,
        role: 'User',
        provider: provider || 'google',
        google_id: googleId,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Google login successful.',
      userId: user.id,
      user_id: user.user_id,
      userUuid: user.user_id,
      username: user.username,
      firstName: user.username,
      email: user.email,
      role: user.role,
      provider: user.provider,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to process Google login.',
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
};
