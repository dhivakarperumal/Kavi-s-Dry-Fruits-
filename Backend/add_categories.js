const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kavis_dry_fruits_db',
  port: process.env.DB_PORT || 3306,
});

const defaultCategories = [
  "Almonds",
  "Cashews",
  "Pistachios",
  "Walnuts",
  "Raisins",
  "Dates",
  "Figs",
  "Apricots",
  "Mixed Dry Fruits",
  "Seeds",
  "Flavored Dry Fruits",
  "Organic Dry Fruits",
  "Gift Packs",
  "Combo Packs",
  "Bulk Packs"
];

async function addCategories() {
  try {
    console.log('Inserting default categories...');
    for (let i = 0; i < defaultCategories.length; i++) {
        const cname = defaultCategories[i];
        const catId = `CAT${String(i + 1).padStart(3, "0")}`;
        const cdescription = `Premium quality ${cname} sourced from the best farms.`;
        
        // Check if already exists
        const [existing] = await pool.query('SELECT id FROM categories WHERE catId = ? OR cname = ?', [catId, cname]);
        if (existing.length === 0) {
            await pool.query(
                'INSERT INTO categories (catId, cname, cdescription, cimgs) VALUES (?, ?, ?, ?)',
                [catId, cname, cdescription, JSON.stringify([])]
            );
            console.log(`Added: ${cname} (${catId})`);
        } else {
            console.log(`Skipped: ${cname} (Already exists)`);
        }
    }
    console.log('Finished!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

addCategories();
