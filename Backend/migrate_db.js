const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const productUploadDir = path.join(__dirname, 'uploads/products');

const getImageExtension = (filePath) => {
  const header = Buffer.alloc(8);
  const file = fs.openSync(filePath, 'r');
  try {
    fs.readSync(file, header, 0, header.length, 0);
  } finally {
    fs.closeSync(file);
  }

  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return '.jpg';
  return null;
};

async function migrateLegacyProductImages(connection) {
  if (!fs.existsSync(productUploadDir)) return;

  const files = fs.readdirSync(productUploadDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && !path.extname(entry.name))
    .map(entry => entry.name);

  for (const fileName of files) {
    const oldPath = path.join(productUploadDir, fileName);
    const extension = getImageExtension(oldPath);
    if (!extension) {
      console.warn(`Skipping unknown product image format: ${fileName}`);
      continue;
    }

    const newFileName = `${fileName}${extension}`;
    const newPath = path.join(productUploadDir, newFileName);
    if (!fs.existsSync(newPath)) fs.renameSync(oldPath, newPath);

    const [rows] = await connection.query('SELECT id, images FROM products WHERE images LIKE ?', [`%${fileName}%`]);
    for (const row of rows) {
      const images = JSON.parse(row.images || '[]');
      const updatedImages = images.map(image => typeof image === 'string' ? image.replaceAll(fileName, newFileName) : image);
      if (JSON.stringify(images) !== JSON.stringify(updatedImages)) {
        await connection.query('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(updatedImages), row.id]);
      }
    }
    console.log(`Migrated product image: ${fileName} -> ${newFileName}`);
  }
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await migrateLegacyProductImages(connection);
    console.log('Adding columns to orders table...');
    // MySQL 8.0.19+ supports IF NOT EXISTS for ADD COLUMN but older ones don't always.
    // We'll use a safer check or just catch the error if it already exists.
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN docketNumber VARCHAR(255) DEFAULT NULL');
      console.log('Added docketNumber');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('docketNumber already exists');
      else throw e;
    }

    try {
      await connection.query('ALTER TABLE orders ADD COLUMN cancelReason TEXT DEFAULT NULL');
      console.log('Added cancelReason');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('cancelReason already exists');
      else throw e;
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN status ENUM(\'active\', \'inactive\') DEFAULT \'active\'');
      console.log('Added status to users');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('status already exists in users');
      else throw e;
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        endpoint TEXT NOT NULL,
        endpoint_hash CHAR(64) NOT NULL UNIQUE,
        subscription LONGTEXT NOT NULL,
        enabled TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    try {
      await connection.query('ALTER TABLE admin_push_subscriptions ADD COLUMN endpoint_hash CHAR(64) NOT NULL UNIQUE');
      console.log('Added endpoint_hash to admin_push_subscriptions');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('endpoint_hash already exists');
      else throw e;
    }

    try {
      await connection.query('UPDATE products SET totalStock = totalWeight WHERE (totalStock IS NULL OR totalStock = 0) AND totalWeight IS NOT NULL');
      await connection.query('ALTER TABLE products DROP COLUMN totalWeight');
      console.log('Moved totalWeight values to totalStock and removed totalWeight');
    } catch (e) {
      if (e.code === 'ER_BAD_FIELD_ERROR' || e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('No products.totalWeight column to remove');
      } else {
        throw e;
      }
    }

    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
