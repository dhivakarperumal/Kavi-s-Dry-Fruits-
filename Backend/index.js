const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./src/config/db');
const authRoutes = require('./src/routers/authRoutes');
const categoryRoutes = require('./src/routers/categoryRoutes');
const productRoutes = require('./src/routers/productRoutes');
const comboRoutes = require('./src/routers/comboRoutes');
const userRoutes = require('./src/routers/userRoutes');
const reviewRoutes = require('./src/routers/reviewRoutes');
const dealerRoutes = require('./src/routers/dealerRoutes');
const stickerRoutes = require('./src/routers/stickerRoutes');
const seoRoutes = require('./src/routers/seoRoutes');



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
app.use('/api/combos', comboRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/stickers', stickerRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/users', userRoutes);

// Invoices Routes
app.get('/api/invoices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName } = req.body;
    const [result] = await db.query(
      'INSERT INTO invoices (invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [invoiceNo, invoiceDate, invoiceValue, invoiceGSTValue, invoiceTotalValue, transportAmount, billPdfBase64, billPdfName]
    );
    res.json({ id: result.insertId, message: 'Invoice created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stock History Routes
app.post('/api/stock-history', async (req, res) => {
  try {
    const { productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type } = req.body;
    const [result] = await db.query(
      'INSERT INTO stock_history (productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, productName, productCategory, addedQuantity, finalStock, invoiceNumber, type]
    );
    res.json({ id: result.insertId, message: 'Stock history logged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { orderId, clientName, clientPhone, clientGST, shippingAddress, customerType, paymentMode, orderStatus, shippingCharge, items, gstAmount, totalAmount } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (orderId, clientName, clientPhone, clientGST, shippingAddress, customerType, paymentMode, orderStatus, shippingCharge, items, gstAmount, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, clientName, clientPhone, clientGST, JSON.stringify(shippingAddress), customerType, paymentMode, orderStatus, shippingCharge, JSON.stringify(items), gstAmount, totalAmount]
    );
    res.json({ id: result.insertId, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    await db.query('UPDATE orders SET orderStatus = ? WHERE id = ?', [orderStatus, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Benefits Routes
app.get('/api/health-benefits', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM health_benefits ORDER BY createdAt DESC');
    res.json(rows.map(row => ({
      ...row,
      benefits: JSON.parse(row.benefits || '[]'),
      images: JSON.parse(row.images || '[]'),
      videos: JSON.parse(row.videos || '[]')
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/health-benefits', async (req, res) => {
  try {
    const { productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore } = req.body;
    const [result] = await db.query(
      'INSERT INTO health_benefits (productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [productId, productName, category, shortDescription, detailedDescription, JSON.stringify(benefits), JSON.stringify(images), JSON.stringify(videos), howToEat, howToStore]
    );
    res.json({ id: result.insertId, message: 'Health benefit created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/health-benefits/:id', async (req, res) => {
  try {
    const { productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore } = req.body;
    await db.query(
      'UPDATE health_benefits SET productId=?, productName=?, category=?, shortDescription=?, detailedDescription=?, benefits=?, images=?, videos=?, howToEat=?, howToStore=? WHERE id=?',
      [productId, productName, category, shortDescription, detailedDescription, JSON.stringify(benefits), JSON.stringify(images), JSON.stringify(videos), howToEat, howToStore, req.params.id]
    );
    res.json({ message: 'Health benefit updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/health-benefits/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM health_benefits WHERE id = ?', [req.params.id]);
    res.json({ message: 'Health benefit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



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
      description TEXT,
      healthBenefits TEXT,
      category VARCHAR(255),
      rating DECIMAL(3,2) DEFAULT 0,
      barcode LONGTEXT,
      barcodeValue VARCHAR(100),
      images LONGTEXT,
      variants LONGTEXT,
      totalStock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS combos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      healthBenefits TEXT,
      category VARCHAR(255) DEFAULT 'Combo Packs',
      rating DECIMAL(3,2) DEFAULT 0,
      barcode LONGTEXT,
      barcodeValue VARCHAR(100),
      images LONGTEXT,
      comboItems LONGTEXT,
      comboDetails LONGTEXT,
      totalStock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);


  await db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      reviewId VARCHAR(50) NOT NULL UNIQUE,
      userName VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      image LONGTEXT,
      selected BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      orderId VARCHAR(50) NOT NULL UNIQUE,
      clientName VARCHAR(255),
      clientPhone VARCHAR(50),
      clientGST VARCHAR(100),
      shippingAddress TEXT,
      customerType VARCHAR(100),
      paymentMode VARCHAR(100),
      orderStatus VARCHAR(100) DEFAULT 'Pending',
      shippingCharge DECIMAL(15,2),
      items LONGTEXT,
      gstAmount DECIMAL(15,2),
      totalAmount DECIMAL(15,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS dealers (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      dealerId VARCHAR(50) NOT NULL UNIQUE,
      dealerName VARCHAR(255) NOT NULL,
      dealerGSTNumber VARCHAR(100),
      dealerPhoneNumber VARCHAR(20) NOT NULL,
      dealerMail VARCHAR(255),
      dealerAddress TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      invoiceNo VARCHAR(100) NOT NULL UNIQUE,
      invoiceDate DATE,
      invoiceValue DECIMAL(15,2),
      invoiceGSTValue DECIMAL(15,2),
      invoiceTotalValue DECIMAL(15,2),
      transportAmount DECIMAL(15,2),
      billPdfBase64 LONGTEXT,
      billPdfName VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS stock_history (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      productName VARCHAR(255),
      productCategory VARCHAR(255),
      addedQuantity INT,
      finalStock INT,
      invoiceNumber VARCHAR(100),
      type VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS health_benefits (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50),
      productName VARCHAR(255),
      category VARCHAR(255),
      shortDescription TEXT,
      detailedDescription TEXT,
      benefits LONGTEXT,
      images LONGTEXT,
      videos LONGTEXT,
      howToEat TEXT,
      howToStore TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  await ensureColumnExists('password', 'VARCHAR(255) NULL', 'AFTER role');
  await ensureColumnExists('provider', "VARCHAR(50) DEFAULT 'local' NULL", 'AFTER password');
  await ensureColumnExists('google_id', 'VARCHAR(255) NULL', 'AFTER provider');

  await dropIndexIfExists('user_id_2');
  await dropIndexIfExists('uid');

  const [blankRows] = await db.query("SELECT id FROM users WHERE user_id IS NULL OR user_id = ''");
  for (const row of blankRows) {
    await db.query("UPDATE users SET user_id = ? WHERE id = ?", [createUuid(), row.id]);
  }

  await db.query("ALTER TABLE users MODIFY COLUMN user_id VARCHAR(36) NOT NULL");

  // Maintenance for products table
  const [pDescription] = await db.query('SHOW COLUMNS FROM products LIKE "description"');
  if (pDescription.length === 0) {
    console.log('Adding products.description column');
    await db.query('ALTER TABLE products ADD COLUMN description TEXT AFTER name');
  }

  const [pBarcode] = await db.query('SHOW COLUMNS FROM products LIKE "barcode"');
  if (pBarcode.length > 0 && pBarcode[0].Type.toLowerCase().indexOf('longtext') === -1) {
    console.log('Updating products.barcode to LONGTEXT');
    await db.query('ALTER TABLE products MODIFY COLUMN barcode LONGTEXT');
  }
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