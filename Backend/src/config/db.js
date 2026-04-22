const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kavis_dry_fruits_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Helper for UUIDs
const createUuid = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// Database Initialization Logic
const initializeDatabase = async () => {
  const tableDefinitions = require('../modules/tableDefinitions');
  try {
    await promisePool.query('SET SESSION max_allowed_packet = 104857600');
  } catch (e) { console.warn('Packet size error:', e.message); }

  console.log('Initializing database tables...');
  for (const [tableName, sql] of Object.entries(tableDefinitions)) {
    try {
      await promisePool.query(sql);
    } catch (err) {
      console.error(`❌ Error creating table ${tableName}:`, err.message);
    }
  }

  // Column Sync Logic
  const syncColumns = async (table, definitionSql) => {
    try {
      const columnMatches = definitionSql.matchAll(/^\s*([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_()]+)/gm);
      for (const match of columnMatches) {
        const columnName = match[1];
        const columnType = match[2];
        if (['CREATE', 'TABLE', 'IF', 'NOT', 'EXISTS', 'PRIMARY', 'UNIQUE', 'DEFAULT', 'ENGINE', 'CHARSET'].includes(columnName.toUpperCase())) continue;
        const [cols] = await promisePool.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [columnName]);
        if (cols.length === 0) {
          console.log(`[Sync] Adding missing column: ${table}.${columnName}`);
          await promisePool.query(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType}`);
        }
      }
    } catch (err) { console.warn(`[Sync-Warn] ${table} sync failed:`, err.message); }
  };

  await syncColumns('products', tableDefinitions.products);
  await syncColumns('combos', tableDefinitions.combos);
  await syncColumns('categories', tableDefinitions.categories);

  // UUID Maintenance
  try {
    const [blankRows] = await promisePool.query("SELECT id FROM users WHERE user_id IS NULL OR user_id = ''");
    for (const row of blankRows) {
      await promisePool.query("UPDATE users SET user_id = ? WHERE id = ?", [createUuid(), row.id]);
    }
  } catch (e) {}
};

const ensureAdminUser = async () => {
  const [admins] = await promisePool.query('SELECT id FROM users WHERE email = ?', ['admin@gmail.com']);
  if (admins.length > 0) return;
  const passwordHash = await bcrypt.hash('admin@123', 10);
  await promisePool.query(
    'INSERT INTO users (user_id, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
    [createUuid(), 'Admin', 'admin@gmail.com', '', passwordHash, 'Admin']
  );
  console.log('✓ Default admin user created');
};

promisePool.initializeDatabase = initializeDatabase;
promisePool.ensureAdminUser = ensureAdminUser;

module.exports = promisePool;