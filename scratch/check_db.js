const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kavi_dry_fruits'
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM combos');
    console.log('Combos found:', rows.length);
    console.log(JSON.stringify(rows, null, 2));
    
    const [stickers] = await connection.execute(`
      SELECT id, productId, name, barcode, barcodeValue, 'Products' as type FROM products
      UNION ALL
      SELECT id, productId, name, barcode, barcodeValue, 'Combos' as type FROM combos
      ORDER BY name ASC
    `);
    console.log('Sticker products results:', stickers.slice(0, 5));
  } finally {
    await connection.end();
  }
}

check();
