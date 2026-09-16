const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
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
