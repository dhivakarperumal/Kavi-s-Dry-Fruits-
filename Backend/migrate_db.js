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
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('docketNumber already exists');
      else throw e;
    }

    try {
      await connection.query('ALTER TABLE orders ADD COLUMN cancelReason TEXT DEFAULT NULL');
      console.log('Added cancelReason');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('cancelReason already exists');
      else throw e;
    }

    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
