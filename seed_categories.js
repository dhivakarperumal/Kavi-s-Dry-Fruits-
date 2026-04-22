const db = require('./Backend/src/config/db');

const categories = [
  {
    "catId": "CAT001",
    "cname": "Nuts",
    "cdescription": "Premium quality nuts like almonds, cashews, walnuts and pistachios.",
    "cimgs": "[]"
  },
  {
    "catId": "CAT002",
    "cname": "Dates",
    "cdescription": "Naturally sweet and healthy dates rich in energy and nutrients.",
    "cimgs": "[]"
  },
  {
    "catId": "CAT003",
    "cname": "Seeds",
    "cdescription": "Healthy seeds like chia, flax and others rich in fiber and omega-3.",
    "cimgs": "[]"
  },
  {
    "catId": "CAT004",
    "cname": "Raisins",
    "cdescription": "Dried grapes available in black and golden varieties.",
    "cimgs": "[]"
  },
  {
    "catId": "CAT005",
    "cname": "Dry Fruits",
    "cdescription": "Combination of nuts, seeds and raisins for balanced nutrition.",
    "cimgs": "[]"
  }
];

async function seedCategories() {
  try {
    for (const cat of categories) {
      const [existing] = await db.query('SELECT id FROM categories WHERE catId = ?', [cat.catId]);
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO categories (catId, cname, cdescription, cimgs) VALUES (?, ?, ?, ?)',
          [cat.catId, cat.cname, cat.cdescription, JSON.stringify(cat.cimgs || [])]
        );
        console.log(`Inserted category: ${cat.cname}`);
      } else {
        console.log(`Category already exists: ${cat.cname}`);
      }
    }
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();
