const db = require('../src/config/db');

async function migrate() {
  try {
    console.log("Checking favorites table...");
    const [columns] = await db.query("SHOW COLUMNS FROM favorites LIKE 'category'");
    
    if (columns.length === 0) {
      console.log("Adding 'category' column to favorites table...");
      await db.query("ALTER TABLE favorites ADD COLUMN category VARCHAR(50) DEFAULT 'General'");
      console.log("✓ Migration successful!");
    } else {
      console.log("✓ 'category' column already exists.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
