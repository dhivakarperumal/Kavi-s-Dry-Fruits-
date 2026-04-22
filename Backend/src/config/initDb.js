const db = require('./db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const tableDefinitions = require('../modules/tableDefinitions');

const createUuid = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const initializeDatabase = async () => {
  try {
    console.log('Optimizing MySQL connection settings...');
    await db.query('SET SESSION max_allowed_packet = 104857600'); // 100MB
  } catch (e) {
    console.warn('⚠️ Could not set max_allowed_packet:', e.message);
  }

  // Execute all table creations from modules
  console.log('Initializing database tables...');
  for (const [tableName, sql] of Object.entries(tableDefinitions)) {
    try {
      await db.query(sql);
    } catch (err) {
      console.error(`❌ Error creating table ${tableName}:`, err.message);
    }
  }

  await maintenanceChecks();
};

const maintenanceChecks = async () => {
    // 1. Column Synchronization (Ensure columns from tableDefinitions exist in the live DB)
    const syncColumns = async (table, definitionSql) => {
        try {
            // Extract column names from the CREATE TABLE string (basic regex)
            const columnMatches = definitionSql.matchAll(/^\s*([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_()]+)/gm);
            for (const match of columnMatches) {
                const columnName = match[1];
                const columnType = match[2];
                
                if (['CREATE', 'TABLE', 'IF', 'NOT', 'EXISTS', 'PRIMARY', 'UNIQUE', 'DEFAULT', 'ENGINE', 'CHARSET'].includes(columnName.toUpperCase())) continue;

                const [cols] = await db.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [columnName]);
                if (cols.length === 0) {
                    console.log(`[Sync] Adding missing column: ${table}.${columnName}`);
                    await db.query(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType}`);
                }
            }
        } catch (err) {
            console.warn(`[Sync-Warn] Table ${table} structure check failed:`, err.message);
        }
    };

    // Auto-sync products and combos for columns like lastInvoice
    await syncColumns('products', tableDefinitions.products);
    await syncColumns('combos', tableDefinitions.combos);
    await syncColumns('categories', tableDefinitions.categories);

    // 2. Data Maintenance
    // UUID maintenance for existing users
    try {
        const [blankRows] = await db.query("SELECT id FROM users WHERE user_id IS NULL OR user_id = ''");
        for (const row of blankRows) {
            await db.query("UPDATE users SET user_id = ? WHERE id = ?", [createUuid(), row.id]);
        }
    } catch (e) { console.warn('User UUID maintenance skip:', e.message); }
};

const ensureAdminUser = async () => {
    const [admins] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@gmail.com']);
    if (admins.length > 0) return console.log('✓ Admin user exists');
    
    const passwordHash = await bcrypt.hash('admin@123', 10);
    await db.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [createUuid(), 'Admin', 'admin@gmail.com', '', passwordHash, 'Admin']
    );
    console.log('✓ Default admin user created');
};

module.exports = { initializeDatabase, ensureAdminUser };
