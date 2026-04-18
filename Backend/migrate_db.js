const db = require('./src/config/db');

async function migrate() {
  try {
    console.log("Starting deep migration...");
    
    // Create seo_keywords table if it doesn't exist
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS seo_keywords (
          id INT AUTO_INCREMENT PRIMARY KEY,
          keywords LONGTEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log("[+] Created seo_keywords table");
    } catch (e) {
      console.log("seo_keywords table already exists or error:", e.message);
    }
    
    const tables = ['products', 'combos'];
    const columns = [
        { name: 'healthBenefits', type: 'LONGTEXT' },
        { name: 'barcode', type: 'LONGTEXT' },
        { name: 'barcodeValue', type: 'VARCHAR(255)' },
        { name: 'totalStock', type: 'INT DEFAULT 0' },
        { name: 'comboItems', type: 'LONGTEXT' },
        { name: 'comboDetails', type: 'LONGTEXT' },
        { name: 'rating', type: 'INT DEFAULT 5' }
    ];

    for (const table of tables) {
        for (const col of columns) {
            try {
                await db.query(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type}`);
                console.log(`[+] Added ${col.name} to ${table}`);
            } catch (e) {
                // Column already exists usually
            }
        }
    }

    console.log("Deep migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
