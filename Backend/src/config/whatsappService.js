const twilio = require('twilio');

/**
 * Send a WhatsApp OTP message via Twilio.
 * In development mode (NODE_ENV=development) this is bypassed
 * and the OTP is only logged to the console.
 *
 * @param {string} phone  - E.164 format, e.g. +919876543210
 * @param {string} otp    - 6-digit OTP string
 */
const sendWhatsAppOTP = async (phone, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  let fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  if (fromNumber) {
    fromNumber = fromNumber.replace('whatsapp:', '');
  }

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials are not set in .env');
  }

  const client = twilio(accountSid, authToken);

  await client.messages.create({
    from: `whatsapp:${fromNumber}`,
    to:   `whatsapp:${phone}`,
    body: `🔐 *KAVI'S Dry Fruits*\n\nYour verification code is:\n\n*${otp}*\n\nValid for *5 minutes*. Do not share this code with anyone.\n\n– Team KAVI'S`,
  });
};

module.exports = { sendWhatsAppOTP };
