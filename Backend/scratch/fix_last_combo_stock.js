const db = require('../src/config/db');

async function fixLastComboStock() {
  try {
    // Get the last combo
    const [rows] = await db.query('SELECT * FROM combos ORDER BY created_at DESC LIMIT 1');
    if (rows.length === 0) return console.log('No combos found.');
    
    const last = rows[0];
    console.log(`Last combo: "${last.name}" (id: ${last.id}), totalStock: ${last.totalStock}`);
    
    if (last.totalStock > 0) {
      return console.log('Stock is already set. No fix needed.');
    }

    // Prompt or just set a default
    const newStock = 50; // Change this to whatever stock value you want
    await db.query('UPDATE combos SET totalStock = ? WHERE id = ?', [newStock, last.id]);
    console.log(`✓ Updated totalStock to ${newStock} for combo "${last.name}"`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixLastComboStock();
