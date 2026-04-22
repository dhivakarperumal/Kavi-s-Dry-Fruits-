const db = require('./Backend/src/config/db');

const combos = [
  {
    "productId": "KPR001",
    "name": "Family Combo",
    "description": "KAVI’S Family Combo is a premium assortment of carefully selected dry fruits packed to preserve freshness and natural taste. Each item is rich in essential nutrients and supports a healthy lifestyle. Ideal for daily consumption, festive occasions, and family sharing. Free from artificial colors and preservatives.",
    "healthBenefits": ["Boosts Immunity", "Heart Health", "Brain Power", "Energy Booster", "Digestive Support", "Bone Strength"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g", "image": "" },
      { "name": "Walnuts", "weight": "250g", "image": "" },
      { "name": "Cashews", "weight": "250g", "image": "" },
      { "name": "Pistachios", "weight": "250g", "image": "" },
      { "name": "Yellow Raisins", "weight": "250g", "image": "" },
      { "name": "Black Raisins", "weight": "250g", "image": "" },
      { "name": "Dried Figs", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 2000, "offerPercent": 20, "offerPrice": 1600 },
    "totalStock": "40",
    "barcode": "",
    "barcodeValue": "KPR001",
    "rating": 5
  },
  {
    "productId": "KPR002",
    "name": "Daily Health Combo",
    "description": "This combo is designed for everyday nutrition with a balanced mix of healthy dry fruits. It provides essential vitamins, minerals, and natural energy for your daily routine. Perfect for breakfast, snacking, or adding to meals. Hygienically packed to maintain quality and freshness.",
    "healthBenefits": ["Energy Boost", "Immunity Support", "Heart Health"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g", "image": "" },
      { "name": "Cashews", "weight": "250g", "image": "" },
      { "name": "Black Raisins", "weight": "250g", "image": "" },
      { "name": "Dates", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 1200, "offerPercent": 15, "offerPrice": 1020 },
    "totalStock": "60",
    "barcode": "",
    "barcodeValue": "KPR002",
    "rating": 4.5
  },
  {
    "productId": "KPR003",
    "name": "Kids Power Combo",
    "description": "A nutritious blend specially curated for children’s growth and energy needs. Packed with essential nutrients to support brain development and physical strength. Ideal for school snacks and daily diet routines. Made with high-quality ingredients for better health benefits.",
    "healthBenefits": ["Brain Development", "Energy Boost", "Bone Strength"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "200g", "image": "" },
      { "name": "Cashews", "weight": "200g", "image": "" },
      { "name": "Dates", "weight": "200g", "image": "" }
    ],
    "comboDetails": { "mrp": 900, "offerPercent": 10, "offerPrice": 810 },
    "totalStock": "50",
    "barcode": "",
    "barcodeValue": "KPR003",
    "rating": 4.2
  },
  {
    "productId": "KPR004",
    "name": "Immunity Booster Combo",
    "description": "A powerful combination of nutrient-rich dry fruits that help strengthen immunity naturally. Rich in antioxidants and essential nutrients for overall wellness. Suitable for daily consumption and seasonal health support. Carefully packed to ensure maximum freshness.",
    "healthBenefits": ["Immunity Boost", "Antioxidant Rich", "Energy"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Walnuts", "weight": "250g", "image": "" },
      { "name": "Almonds", "weight": "250g", "image": "" },
      { "name": "Raisins", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 1100, "offerPercent": 12, "offerPrice": 968 },
    "totalStock": "45",
    "barcode": "",
    "barcodeValue": "KPR004",
    "rating": 4.7
  },
  {
    "productId": "KPR005",
    "name": "Weight Gain Combo",
    "description": "This combo is specially curated for healthy weight gain with high-calorie dry fruits. It provides sustained energy and supports muscle development. Ideal for fitness enthusiasts and those looking to increase weight naturally. Packed fresh with premium ingredients.",
    "healthBenefits": ["Weight Gain", "Energy Boost", "Muscle Support"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Cashews", "weight": "300g", "image": "" },
      { "name": "Almonds", "weight": "300g", "image": "" },
      { "name": "Dates", "weight": "300g", "image": "" }
    ],
    "comboDetails": { "mrp": 1300, "offerPercent": 18, "offerPrice": 1066 },
    "totalStock": "30",
    "barcode": "",
    "barcodeValue": "KPR005",
    "rating": 4.3
  },
  {
    "productId": "KPR006",
    "name": "Premium Nuts Combo",
    "description": "A premium selection of top-quality nuts designed for daily nutrition and wellness. Rich in proteins, healthy fats, and essential nutrients. Perfect for snacking or adding to meals. Carefully packed to retain freshness and crunch.",
    "healthBenefits": ["Heart Health", "Protein Rich", "Brain Boost"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g", "image": "" },
      { "name": "Walnuts", "weight": "250g", "image": "" },
      { "name": "Pistachios", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 1400, "offerPercent": 20, "offerPrice": 1120 },
    "totalStock": "35",
    "barcode": "",
    "barcodeValue": "KPR006",
    "rating": 5
  },
  {
    "productId": "KPR007",
    "name": "Festive Special Combo",
    "description": "A perfect festive gift pack with a rich assortment of premium dry fruits. Designed for celebrations and special occasions. Offers a blend of taste, nutrition, and quality. Elegantly packed for gifting and sharing.",
    "healthBenefits": ["Energy Boost", "Premium Quality", "Healthy Snack"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Almonds", "weight": "250g", "image": "" },
      { "name": "Cashews", "weight": "250g", "image": "" },
      { "name": "Pistachios", "weight": "250g", "image": "" },
      { "name": "Raisins", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 1600, "offerPercent": 15, "offerPrice": 1360 },
    "totalStock": "25",
    "barcode": "",
    "barcodeValue": "KPR007",
    "rating": 4.8
  },
  {
    "productId": "KPR008",
    "name": "Budget Combo",
    "description": "An affordable combo designed for everyday use without compromising on nutrition. Provides a balanced mix of essential nutrients for daily energy. Suitable for regular snacking and family use. Packed hygienically to ensure quality.",
    "healthBenefits": ["Energy", "Budget Friendly", "Nutrition"],
    "category": "Combo Packs",
    "images": [],
    "comboItems": [
      { "name": "Peanuts", "weight": "500g", "image": "" },
      { "name": "Raisins", "weight": "250g", "image": "" }
    ],
    "comboDetails": { "mrp": 500, "offerPercent": 10, "offerPrice": 450 },
    "totalStock": "80",
    "barcode": "",
    "barcodeValue": "KPR008",
    "rating": 3.8
  }
];

async function seedCombos() {
  try {
    for (const combo of combos) {
      const [existing] = await db.query('SELECT id FROM combos WHERE productId = ?', [combo.productId]);
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
        console.log(`Combo already exists: ${combo.name}`);
      }
    }
    console.log('Combo seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Combo seeding failed:', error);
    process.exit(1);
  }
}

seedCombos();
