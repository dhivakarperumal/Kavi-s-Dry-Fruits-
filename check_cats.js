const db = require('./Backend/src/config/db');
async function check() {
  const [rows] = await db.query("SELECT cname, cimgs FROM categories");
  rows.forEach(r => {
    console.log(`Category: ${r.cname}`);
    console.log(`Cimgs: ${r.cimgs}`);
  });
  process.exit(0);
}
check();
