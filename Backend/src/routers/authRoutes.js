const express      = require('express');
const rateLimit    = require('express-rate-limit');
const { register, login, googleLogin, sendOtp, verifyOtp } = require('../controllers/authController');

const router = express.Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// Max 5 OTP requests per phone per 10 minutes
const sendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Please wait 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Max 10 verify attempts per IP per 15 minutes
const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many verification attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General auth rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post('/register',      authLimiter, register);
router.post('/login',         authLimiter, login);
router.post('/google-login',  authLimiter, googleLogin);

// WhatsApp OTP routes
router.post('/send-otp',      sendOtpLimiter,   sendOtp);
router.post('/verify-otp',    verifyOtpLimiter,  verifyOtp);

module.exports = router;
