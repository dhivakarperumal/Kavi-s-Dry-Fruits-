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

  // Column Sync Logic - handles types with precision like DECIMAL(10, 8), VARCHAR(255)
  const syncColumns = async (table, definitionSql) => {
    try {
      // Regex captures the full column definition, including DEFAULT and ON UPDATE clauses.
      const columnMatches = definitionSql.matchAll(/^\s*([a-zA-Z0-9_]+)\s+(.+?)(?=\s*,\s*$|\s*$)/gm);
      for (const match of columnMatches) {
        const columnName = match[1];
        const columnDefinition = match[2].trim();
        const columnType = columnDefinition.replace(/\s+(?:NOT NULL|NULL|DEFAULT|AUTO_INCREMENT|UNIQUE|PRIMARY|KEY|COMMENT|ON UPDATE|REFERENCES).*$/i, '').trim();
        if (['CREATE', 'TABLE', 'IF', 'NOT', 'EXISTS', 'PRIMARY', 'UNIQUE', 'DEFAULT', 'ENGINE', 'CHARSET', 'KEY', 'CONSTRAINT', 'FOREIGN', 'INDEX'].includes(columnName.toUpperCase())) continue;
        const [cols] = await promisePool.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [columnName]);
        if (cols.length === 0) {
          console.log(`[Sync] Adding missing column: ${table}.${columnName} (${columnDefinition})`);
          await promisePool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`);
        }
      }
    } catch (err) { console.warn(`[Sync-Warn] ${table} sync failed:`, err.message); }
  };

  await syncColumns('products', tableDefinitions.products);
  await syncColumns('combos', tableDefinitions.combos);
  await syncColumns('categories', tableDefinitions.categories);
  await syncColumns('reviews', tableDefinitions.reviews);
  await syncColumns('orders', tableDefinitions.orders);
  await syncColumns('order_items', tableDefinitions.order_items);
  await syncColumns('order_tracking', tableDefinitions.order_tracking);
  await syncColumns('delivery_agents', tableDefinitions.delivery_agents);
  await syncColumns('delivery_locations', tableDefinitions.delivery_locations);
  await syncColumns('cart', tableDefinitions.cart);
  await syncColumns('favorites', tableDefinitions.favorites);
  await syncColumns('coupons', tableDefinitions.coupons);
  await syncColumns('stock_history', tableDefinitions.stock_history);
  await syncColumns('dealers', tableDefinitions.dealers);
  await syncColumns('invoices', tableDefinitions.invoices);
  await syncColumns('banners', tableDefinitions.banners);
  await syncColumns('user_addresses', tableDefinitions.user_addresses);
  await syncColumns('health_benefits', tableDefinitions.health_benefits);
  await syncColumns('seo_keywords', tableDefinitions.seo_keywords);
  await syncColumns('seo_settings', tableDefinitions.seo_settings);
  await syncColumns('app_settings', tableDefinitions.app_settings);
  await syncColumns('site_settings', tableDefinitions.site_settings);
  await syncColumns('sticker_records', tableDefinitions.sticker_records);
  await syncColumns('contact_submissions', tableDefinitions.contact_submissions);

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