const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./src/config/db');
const authRoutes = require('./src/routers/authRoutes');
const categoryRoutes = require('./src/routers/categoryRoutes');
const productRoutes = require('./src/routers/productRoutes');



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);



// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to Car Booking API');
});

const createUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const initializeDatabase = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'User',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      catId VARCHAR(50) NOT NULL UNIQUE,
      cname VARCHAR(255) NOT NULL,
      cdescription TEXT,
      cimgs LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      rating DECIMAL(3,2) DEFAULT 0,
      barcode VARCHAR(100),
      barcodeValue TEXT,
      productType ENUM('single', 'combo') DEFAULT 'single',
      images LONGTEXT,
      variants LONGTEXT,
      comboItems LONGTEXT,
      comboDetails LONGTEXT,
      totalStock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);




  const ensureColumnExists = async (name, definition, positionAfter) => {
    const [cols] = await db.query('SHOW COLUMNS FROM users LIKE ?', [name]);
    if (cols.length === 0) {
      console.log(`Adding missing users.${name} column`);
      await db.query(`ALTER TABLE users ADD COLUMN ${name} ${definition} ${positionAfter || ''}`);
    }
  };

  const dropIndexIfExists = async (indexName) => {
    const [indexes] = await db.query('SHOW INDEX FROM users WHERE Key_name = ?', [indexName]);
    if (indexes.length > 0) {
      console.log(`Dropping duplicate index ${indexName}`);
      await db.query('ALTER TABLE users DROP INDEX `' + indexName + '`');
    }
  };

  await ensureColumnExists('user_id', 'VARCHAR(36) NULL UNIQUE', 'AFTER id');
  await ensureColumnExists('phone', 'VARCHAR(50) NULL', 'AFTER email');
  await ensureColumnExists('password_hash', 'VARCHAR(255) NULL', 'AFTER phone');
  await ensureColumnExists('role', "VARCHAR(50) DEFAULT 'User' NULL", 'AFTER password_hash');
  await ensureColumnExists('provider', "VARCHAR(50) DEFAULT 'local' NULL", 'AFTER role');
  await ensureColumnExists('google_id', 'VARCHAR(255) NULL', 'AFTER provider');

  await dropIndexIfExists('user_id_2');
  await dropIndexIfExists('uid');

  const [blankRows] = await db.query("SELECT id FROM users WHERE user_id IS NULL OR user_id = ''");
  for (const row of blankRows) {
    await db.query("UPDATE users SET user_id = ? WHERE id = ?", [createUuid(), row.id]);
  }

  await db.query("ALTER TABLE users MODIFY COLUMN user_id VARCHAR(36) NOT NULL");
};

const ensureAdminUser = async () => {
  const [admins] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@gmail.com']);
  if (admins.length > 0) {
    console.log('✓ Admin user already exists');
    return;
  }
  const passwordHash = await bcrypt.hash('admin@123', 10);
  const userId = createUuid();
  await db.query(
    'INSERT INTO users (user_id, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, 'Admin', 'admin@gmail.com', '', passwordHash, 'Admin']
  );
  console.log('✓ Default admin user created: admin@gmail.com / admin@123');
};

// Test Connection
(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✓ MySQL Connected Successfully');
    
    // Initialize database tables
    await initializeDatabase();
    await ensureAdminUser();
  } catch (error) {
    console.error('✗ Unable to connect to MySQL:', error.message);
  }
})();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});