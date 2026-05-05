const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');
const { sendWhatsAppOTP } = require('../config/whatsappService');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const createUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, userUuid: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '9d' }
  );

// ─────────────────────────────────────────────
// Email / Password  ─  Register
// ─────────────────────────────────────────────

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
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userUuid     = createUuid();
    const [result]     = await db.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userUuid, firstName.trim(), normalizedEmail, normalizedPhone, passwordHash, password, 'User']
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      userId:   result.insertId,
      user_id:  userUuid,
      userUuid,
      username: firstName.trim(),
      email:    normalizedEmail,
      role:     'User',
    });
  } catch (error) {
    console.error('Auth register error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.sqlMessage.includes('email') ? 'Email' : 'User ID';
      return res.status(409).json({ success: false, message: `${field} already exists.` });
    }
    return res.status(500).json({ success: false, message: 'Unable to register user.' });
  }
};

// ─────────────────────────────────────────────
// Email / Password  ─  Login
// ─────────────────────────────────────────────

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, user_id, username, email, phone, password_hash, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    const user = users[0];
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = signToken(user);

    return res.json({
      success:   true,
      message:   'Login successful.',
      token,
      userId:    user.id,
      user_id:   user.user_id,
      userUuid:  user.user_id,
      username:  user.username,
      firstName: user.username,
      email:     user.email,
      phone:     user.phone,
      role:      user.role || 'User',
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ success: false, message: 'Unable to log in.' });
  }
};

// ─────────────────────────────────────────────
// Google  ─  Login / Register
// ─────────────────────────────────────────────

const googleLogin = async (req, res) => {
  const { firstName, lastName, username, email, googleId, provider } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      const userUuid  = createUuid();
      const fullName  = `${firstName} ${lastName}`.trim();
      const [result]  = await db.query(
        'INSERT INTO users (user_id, username, email, role, provider, google_id) VALUES (?, ?, ?, ?, ?, ?)',
        [userUuid, fullName || username, normalizedEmail, 'User', provider || 'google', googleId]
      );
      user = {
        id: result.insertId, user_id: userUuid,
        username: fullName || username, email: normalizedEmail,
        role: 'User', provider: provider || 'google', google_id: googleId,
      };
    }

    const token = signToken(user);

    return res.status(200).json({
      success:   true,
      message:   'Google login successful.',
      token,
      userId:    user.id,
      user_id:   user.user_id,
      userUuid:  user.user_id,
      username:  user.username,
      firstName: user.username,
      email:     user.email,
      role:      user.role,
      provider:  user.provider,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ success: false, message: 'Unable to process Google login.' });
  }
};

// ─────────────────────────────────────────────
// WhatsApp OTP  ─  Send OTP
// ─────────────────────────────────────────────

const sendOtp = async (req, res) => {
  const { phone } = req.body;

  // Validate Indian mobile: +91 followed by 6-9 starting digit, then 9 more digits
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Enter a valid Indian mobile number (e.g. +919876543210).',
    });
  }

  try {
    // ── Resend cooldown check ────────────────────────────────────────────────
    const [rows] = await db.query(
      `SELECT resend_after FROM otp_sessions
       WHERE phone = ? AND is_used = 0
       ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );
    if (rows.length > 0 && new Date(rows[0].resend_after) > new Date()) {
      const secondsLeft = Math.ceil((new Date(rows[0].resend_after) - new Date()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new OTP.`,
        secondsLeft,
      });
    }

    // ── Generate OTP ─────────────────────────────────────────────────────────
    const otp        = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash    = await bcrypt.hash(otp, 10);
    const expiresAt  = new Date(Date.now() + 5  * 60 * 1000); // +5 min
    const resendAfter = new Date(Date.now() + 30 * 1000);      // +30 sec

    // ── Wipe old sessions for this number, store fresh one ───────────────────
    await db.query('DELETE FROM otp_sessions WHERE phone = ?', [phone]);
    await db.query(
      'INSERT INTO otp_sessions (phone, otp_hash, expires_at, resend_after) VALUES (?, ?, ?, ?)',
      [phone, otpHash, expiresAt, resendAfter]
    );

    // ── Send WhatsApp message ─────────────────────────────────────────────────
    try {
      await sendWhatsAppOTP(phone, otp);
      return res.json({ success: true, message: 'OTP sent to your WhatsApp.' });
    } catch (twilioErr) {
      console.error('\n⚠️ Twilio Error:', twilioErr.message);
      console.log(`🔐 [DEV FALLBACK] WhatsApp OTP for ${phone}: ${otp}\n`);
      return res.json({ 
        success: true, 
        message: 'Twilio failed, but OTP was printed to your server terminal for testing.' 
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
};

// ─────────────────────────────────────────────
// WhatsApp OTP  ─  Verify OTP
// ─────────────────────────────────────────────

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
  }

  try {
    // ── Find latest valid session ────────────────────────────────────────────
    const [sessions] = await db.query(
      `SELECT * FROM otp_sessions
       WHERE phone = ? AND is_used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );

    if (sessions.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'OTP expired or not found. Please request a new one.',
      });
    }

    const session = sessions[0];

    // ── Max 3 attempts ────────────────────────────────────────────────────────
    if (session.attempts >= 3) {
      await db.query('UPDATE otp_sessions SET is_used = 1 WHERE id = ?', [session.id]);
      return res.status(429).json({
        success: false,
        message: 'Too many wrong attempts. Please request a new OTP.',
      });
    }

    // ── Verify hash ───────────────────────────────────────────────────────────
    const isValid = await bcrypt.compare(String(otp), session.otp_hash);
    if (!isValid) {
      await db.query('UPDATE otp_sessions SET attempts = attempts + 1 WHERE id = ?', [session.id]);
      const attemptsLeft = 2 - session.attempts;
      return res.status(401).json({
        success: false,
        message: `Wrong OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left.`,
        attemptsLeft,
      });
    }

    // ── Mark session used ─────────────────────────────────────────────────────
    await db.query('UPDATE otp_sessions SET is_used = 1 WHERE id = ?', [session.id]);

    // ── Upsert user by phone ──────────────────────────────────────────────────
    const [existingUsers] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let user;

    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      const userUuid   = createUuid();
      const last4      = phone.slice(-4);
      const username   = `KavisUser${last4}`;
      const fakeEmail  = `${phone.replace('+', '')}@whatsapp.kavis.com`;
      const fakeHash   = await bcrypt.hash(userUuid, 10);

      const [result] = await db.query(
        `INSERT INTO users
          (user_id, username, email, phone, password_hash, role, provider)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userUuid, username, fakeEmail, phone, fakeHash, 'User', 'whatsapp']
      );

      user = {
        id:       result.insertId,
        user_id:  userUuid,
        username,
        email:    fakeEmail,
        phone,
        role:     'User',
        provider: 'whatsapp',
      };
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = signToken(user);

    return res.json({
      success:   true,
      message:   'Login successful.',
      token,
      userId:    user.id,
      user_id:   user.user_id,
      userUuid:  user.user_id,
      username:  user.username,
      firstName: user.username,
      email:     user.email   || '',
      phone:     user.phone,
      role:      user.role    || 'User',
      provider:  user.provider || 'whatsapp',
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
};

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

module.exports = {
  register,
  login,
  googleLogin,
  sendOtp,
  verifyOtp,
};
