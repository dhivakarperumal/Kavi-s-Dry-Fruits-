const db = require('./src/config/db');
const crypto = require('crypto');
const createUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
(async () => {
  try {
    const userUuid = createUuid();
    const [result] = await db.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userUuid, 'TestUser', 'registertest@example.com', '9999999999', '$2b$10$abcdefghijklmnopqrstuvwx1234567890abcdefg', 'User']
    );
    console.log('insert result', result);
  } catch (err) {
    console.error('insert error', err);
  } finally {
    process.exit(0);
  }
})();
