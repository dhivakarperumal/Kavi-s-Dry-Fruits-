const db = require('./Backend/src/config/db');

const categories = [
  {
    "catId": "CAT001",
    "cname": "Nuts",
    "cdescription": "Premium quality nuts like almonds, cashews, walnuts and pistachios.",
    "cimgs": JSON.stringify({ 
      default: 'https://kavisdryfruits.com/images/Category/nut.png', 
      hover: 'https://kavisdryfruits.com/images/Category/Nuts.png' 
    })
  },
  {
    "catId": "CAT002",
    "cname": "Dates",
    "cdescription": "Naturally sweet and healthy dates rich in energy and nutrients.",
    "cimgs": JSON.stringify({ 
      default: "https://kavisdryfruits.com/images/Category/dates.png", 
      hover: "https://kavisdryfruits.com/images/Category/dates_1.png" 
    })
  },
  {
    "catId": "CAT003",
    "cname": "Seeds",
    "cdescription": "Healthy seeds like chia, flax and others rich in fiber and omega-3.",
    "cimgs": JSON.stringify({ 
      default: 'https://kavisdryfruits.com/images/Category/Pumpkin seeds.png', 
      hover: "https://kavisdryfruits.com/images/Category/Seed.png" 
    })
  },
  {
    "catId": "CAT004",
    "cname": "Raisins",
    "cdescription": "Dried grapes available in black and golden varieties.",
    "cimgs": JSON.stringify({ 
      default: "https://kavisdryfruits.com/images/Category/black_raisan.png", 
      hover: "https://kavisdryfruits.com/images/Category/y.png" 
    })
  },
  {
    "catId": "CAT005",
    "cname": "Dry Fruits",
    "cdescription": "Combination of nuts, seeds and raisins for balanced nutrition.",
    "cimgs": JSON.stringify({ 
      default: 'https://kavisdryfruits.com/images/Category/c3.png', 
      hover: "https://kavisdryfruits.com/images/Category/c4.png" 
    })
  },
  {
    "catId": "CAT006",
    "cname": "Dried Fruits",
    "cdescription": "Delicious and nutritious dried fruits like figs, apricots, and kiwi.",
    "cimgs": JSON.stringify({ 
      default: "https://kavisdryfruits.com/images/Category/fig.png", 
      hover: "https://kavisdryfruits.com/images/Category/fig_1.png" 
    })
  }
];

async function seedCategories() {
  try {
    for (const cat of categories) {
      const [existing] = await db.query('SELECT id FROM categories WHERE cname = ?', [cat.cname]);
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO categories (catId, cname, cdescription, cimgs) VALUES (?, ?, ?, ?)',
          [cat.catId, cat.cname, cat.cdescription, cat.cimgs]
        );
        console.log(`Inserted category: ${cat.cname}`);
      } else {
        await db.query(
          'UPDATE categories SET catId = ?, cdescription = ?, cimgs = ? WHERE cname = ?',
          [cat.catId, cat.cdescription, cat.cimgs, cat.cname]
        );
        console.log(`Updated category: ${cat.cname}`);
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
