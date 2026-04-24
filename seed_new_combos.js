const db = require('./Backend/src/config/db');

const newCombos = [
  {
    "productId": "KPR009",
    "name": "Pregnancy Special Combo",
    "rating": 5,
    "healthBenefits": [
      "Rich in iron and calcium",
      "Supports baby brain development",
      "Improves energy levels",
      "Good for digestion",
      "Contains healthy fats and proteins",
      "Provides essential nutrients"
    ],
    "description": "A carefully curated mix of premium dry fruits and nuts designed to support nutritional needs during pregnancy. Packed with essential vitamins, minerals, fiber, and healthy fats, this combo helps maintain energy, digestion, and overall wellness. Hygienically packed to retain freshness and taste, making it ideal for daily snacking, smoothies, or healthy meals.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g" },
      { "name": "Cashews", "weight": "250g" },
      { "name": "Walnuts", "weight": "250g" },
      { "name": "Pistachios", "weight": "250g" },
      { "name": "Dried Figs", "weight": "250g" },
      { "name": "Golden Raisins", "weight": "250g" },
      { "name": "Black Dates", "weight": "500g" },
      { "name": "Dried Kiwi", "weight": "250g" },
      { "name": "Black Raisins", "weight": "250g" }
    ],
    "comboDetails": { "mrp": 2500, "offerPercent": 10, "offerPrice": 2250 },
    "totalStock": "50",
    "barcodeValue": "KPR009"
  },
  {
    "productId": "KPR010",
    "name": "Dry Fruits Combo",
    "rating": 5,
    "healthBenefits": [
      "Boosts energy",
      "Supports heart and brain health",
      "Strengthens immunity",
      "Improves skin and hair",
      "Aids digestion",
      "Helps in weight management"
    ],
    "description": "A simple and nutritious combo featuring naturally sweet and high-quality dry fruits perfect for daily snacking and sharing. Each item is selected for freshness and taste, offering a balanced mix of flavors and textures suitable for all age groups.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Dates", "weight": "100g" },
      { "name": "Black Raisins", "weight": "100g" },
      { "name": "Figs", "weight": "100g" },
      { "name": "Yellow Raisins", "weight": "100g" }
    ],
    "comboDetails": { "mrp": 600, "offerPercent": 5, "offerPrice": 570 },
    "totalStock": "50",
    "barcodeValue": "KPR010"
  },
  {
    "productId": "KPR011",
    "name": "Super Combo",
    "rating": 5,
    "healthBenefits": [
      "Boosts natural energy",
      "Supports heart health",
      "Improves brain function",
      "Strengthens immunity"
    ],
    "description": "A premium assortment of high-quality dry fruits and dates curated for daily nutrition and gifting. Carefully sourced and hygienically packed to maintain freshness and taste, this combo provides a perfect balance of flavor and health benefits.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g" },
      { "name": "Cashews", "weight": "250g" },
      { "name": "Walnuts", "weight": "250g" },
      { "name": "Figs", "weight": "250g" },
      { "name": "Kimia Dates", "weight": "500g" }
    ],
    "comboDetails": { "mrp": 1500, "offerPercent": 10, "offerPrice": 1350 },
    "totalStock": "50",
    "barcodeValue": "KPR011"
  },
  {
    "productId": "KPR012",
    "name": "Hit Combo",
    "rating": 5,
    "healthBenefits": [
      "Supports immunity and digestion",
      "Improves heart and brain health",
      "Boosts daily energy",
      "Rich in antioxidants",
      "Supports fitness lifestyle",
      "Suitable for all ages"
    ],
    "description": "A powerful combination of 12 premium dry fruits and seeds packed with nutrients for complete daily wellness. Ideal for boosting immunity, energy, and overall health, this combo is perfect for families, fitness lovers, and gifting purposes.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "100g" },
      { "name": "Cashews", "weight": "100g" },
      { "name": "Pistachios", "weight": "100g" },
      { "name": "Walnuts", "weight": "100g" },
      { "name": "Black Raisins", "weight": "100g" },
      { "name": "Kiwi", "weight": "100g" },
      { "name": "Figs", "weight": "100g" },
      { "name": "Dates", "weight": "500g" },
      { "name": "Pumpkin Seeds", "weight": "100g" },
      { "name": "Sunflower Seeds", "weight": "100g" },
      { "name": "Flax Seeds", "weight": "100g" },
      { "name": "Chia Seeds", "weight": "100g" }
    ],
    "comboDetails": { "mrp": 1800, "offerPercent": 15, "offerPrice": 1530 },
    "totalStock": "50",
    "barcodeValue": "KPR012"
  },
  {
    "productId": "KPR013",
    "name": "Ramadan Special Combo",
    "rating": 5,
    "healthBenefits": [
      "Provides instant energy",
      "Supports heart and brain health",
      "Boosts immunity and digestion",
      "Rich in vitamins and minerals",
      "Maintains energy during fasting"
    ],
    "description": "A thoughtfully selected mix of premium dry fruits ideal for Ramadan nutrition. Provides instant energy and essential nutrients during fasting, making it perfect for Iftar and Suhoor meals while maintaining health and energy levels.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g" },
      { "name": "Cashews", "weight": "250g" },
      { "name": "Pistachios", "weight": "250g" },
      { "name": "Dates", "weight": "500g" },
      { "name": "Kismis", "weight": "250g" },
      { "name": "Black Raisins", "weight": "250g" },
      { "name": "Figs", "weight": "250g" }
    ],
    "comboDetails": { "mrp": 2000, "offerPercent": 12, "offerPrice": 1760 },
    "totalStock": "50",
    "barcodeValue": "KPR013"
  },
  {
    "productId": "KPR014",
    "name": "Health Combo - 350g",
    "rating": 5,
    "healthBenefits": [
      "Boosts energy",
      "Supports heart and brain health",
      "Strengthens immunity",
      "Improves skin and hair",
      "Aids digestion",
      "Helps in weight management"
    ],
    "description": "A compact and nutritious mix of premium dry fruits perfect for everyday snacking and healthy living. Each item is rich in natural goodness, offering a balanced combination of taste and essential nutrients.",
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Pistachio", "weight": "80g" },
      { "name": "Almonds", "weight": "100g" },
      { "name": "Walnuts", "weight": "80g" },
      { "name": "Cashews", "weight": "100g" }
    ],
    "comboDetails": { "mrp": 450, "offerPercent": 0, "offerPrice": 450 },
    "totalStock": "50",
    "barcodeValue": "KPR014"
  }
];

async function seedNewCombos() {
  try {
    for (const combo of newCombos) {
      const [existing] = await db.query('SELECT id FROM combos WHERE name = ?', [combo.name]);
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO combos (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, comboItems, comboDetails, totalStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            combo.productId,
            combo.name,
            combo.description,
            JSON.stringify(combo.healthBenefits || []),
            combo.category,
            combo.rating,
            combo.barcode || '',
            combo.barcodeValue || '',
            JSON.stringify(combo.images || []),
            JSON.stringify(combo.comboItems || []),
            JSON.stringify(combo.comboDetails || {}),
            Number(combo.totalStock) || 0
          ]
        );
        console.log(`Inserted combo: ${combo.name}`);
      } else {
        await db.query(
          'UPDATE combos SET productId = ?, description = ?, healthBenefits = ?, category = ?, rating = ?, barcode = ?, barcodeValue = ?, images = ?, comboItems = ?, comboDetails = ?, totalStock = ? WHERE name = ?',
          [
            combo.productId,
            combo.description,
            JSON.stringify(combo.healthBenefits || []),
            combo.category,
            combo.rating,
            combo.barcode || '',
            combo.barcodeValue || '',
            JSON.stringify(combo.images || []),
            JSON.stringify(combo.comboItems || []),
            JSON.stringify(combo.comboDetails || {}),
            Number(combo.totalStock) || 0,
            combo.name
          ]
        );
        console.log(`Updated combo: ${combo.name}`);
      }
    }
    console.log('New combo seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('New combo seeding failed:', error);
    process.exit(1);
  }
}

seedNewCombos();
