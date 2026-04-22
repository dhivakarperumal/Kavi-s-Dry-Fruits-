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
    await db.query('SET GLOBAL max_allowed_packet = 104857600'); // 100MB
  } catch (e) {
    console.warn('⚠️ Could not set GLOBAL max_allowed_packet (Root privileges required). Trying SESSION instead.');
    try {
      await db.query('SET SESSION max_allowed_packet = 104857600');
    } catch (err) {
       console.error('❌ Failed to increase packet size via SESSION:', err.message);
    }
  }

  // Execute all table creations from modules
  console.log('Initializing database tables...');
  for (const [tableName, sql] of Object.entries(tableDefinitions)) {
    try {
      await db.query(sql);
      // console.log(`✓ Table ${tableName} verified`);
    } catch (err) {
      console.error(`❌ Error creating table ${tableName}:`, err.message);
    }
  }

  await maintenanceChecks();
};

const maintenanceChecks = async () => {
    // Check and rename imageUrl to image if it exists in cart table
    try {
      const [cartCols] = await db.query("SHOW COLUMNS FROM cart LIKE 'imageUrl'");
      if (cartCols.length > 0) {
        console.log('🔄 Migrating cart table: Renaming imageUrl to image...');
        await db.query("ALTER TABLE cart CHANGE imageUrl image LONGTEXT");
      }
    } catch (err) { console.warn('Cart migration skip:', err.message); }

    // Check and rename imageUrl to image if it exists in favorites table
    try {
      const [favCols] = await db.query("SHOW COLUMNS FROM favorites LIKE 'imageUrl'");
      if (favCols.length > 0) {
        console.log('🔄 Migrating favorites table: Renaming imageUrl to image...');
        await db.query("ALTER TABLE favorites CHANGE imageUrl image LONGTEXT");
      }
    } catch (err) { console.warn('Favorites migration skip:', err.message); }

    const ensureTableColumnExists = async (table, name, definition, positionAfter) => {
        const [cols] = await db.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [name]);
        if (cols.length === 0) {
          console.log(`Adding missing ${table}.${name} column`);
          await db.query(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition} ${positionAfter || ''}`);
        }
    };
    
    // UUID maintenance for existing users
    const [blankRows] = await db.query("SELECT id FROM users WHERE user_id IS NULL OR user_id = ''");
    for (const row of blankRows) {
        await db.query("UPDATE users SET user_id = ? WHERE id = ?", [createUuid(), row.id]);
    }
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
