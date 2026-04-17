const db = require('./src/config/db');

async function migrate() {
  try {
    console.log("Starting deep migration...");
    
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
