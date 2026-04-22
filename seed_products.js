const { db } = require('./Backend/src/config/db');

const products = [
  {
    "productId": "PR001",
    "name": "Premium Almonds",
    "description": "Crunchy and high-quality almonds rich in nutrients.",
    "healthBenefits": ["Boosts brain", "Rich in Vitamin E", "Heart healthy"],
    "category": "Nuts",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 200, "offerPercent": 10, "offerPrice": 180 },
      { "weight": "250g", "mrp": 480, "offerPercent": 10, "offerPrice": 432 },
      { "weight": "500g", "mrp": 900, "offerPercent": 15, "offerPrice": 765 },
      { "weight": "1000g", "mrp": 1700, "offerPercent": 20, "offerPrice": 1360 }
    ],
    "totalStock": "120",
    "barcode": "",
    "barcodeValue": "PR001",
    "rating": 5
  },
  {
    "productId": "PR002",
    "name": "Cashew Nuts",
    "description": "Premium whole cashews with rich buttery taste.",
    "healthBenefits": ["Good fats", "Improves immunity"],
    "category": "Nuts",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 180, "offerPercent": 5, "offerPrice": 171 },
      { "weight": "250g", "mrp": 420, "offerPercent": 10, "offerPrice": 378 },
      { "weight": "500g", "mrp": 800, "offerPercent": 12, "offerPrice": 704 },
      { "weight": "1000g", "mrp": 1500, "offerPercent": 15, "offerPrice": 1275 }
    ],
    "totalStock": "100",
    "barcode": "",
    "barcodeValue": "PR002",
    "rating": 4.5
  },
  {
    "productId": "PR003",
    "name": "Walnuts",
    "description": "Fresh walnuts rich in omega-3 fatty acids.",
    "healthBenefits": ["Brain health", "Heart support"],
    "category": "Nuts",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 150, "offerPercent": 8, "offerPrice": 138 },
      { "weight": "250g", "mrp": 350, "offerPercent": 10, "offerPrice": 315 },
      { "weight": "500g", "mrp": 650, "offerPercent": 12, "offerPrice": 572 },
      { "weight": "1000g", "mrp": 1200, "offerPercent": 15, "offerPrice": 1020 }
    ],
    "totalStock": "80",
    "barcode": "",
    "barcodeValue": "PR003",
    "rating": 4.2
  },
  {
    "productId": "PR004",
    "name": "Pistachios",
    "description": "Salted pista with premium quality crunch.",
    "healthBenefits": ["Protein rich", "Weight management"],
    "category": "Nuts",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 220, "offerPercent": 10, "offerPrice": 198 },
      { "weight": "250g", "mrp": 520, "offerPercent": 12, "offerPrice": 458 },
      { "weight": "500g", "mrp": 980, "offerPercent": 15, "offerPrice": 833 },
      { "weight": "1000g", "mrp": 1800, "offerPercent": 18, "offerPrice": 1476 }
    ],
    "totalStock": "70",
    "barcode": "",
    "barcodeValue": "PR004",
    "rating": 4.8
  },
  {
    "productId": "PR005",
    "name": "Dates Premium",
    "description": "Soft and naturally sweet Arabian dates.",
    "healthBenefits": ["Energy boost", "Iron rich"],
    "category": "Dates",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 80, "offerPercent": 5, "offerPrice": 76 },
      { "weight": "250g", "mrp": 180, "offerPercent": 8, "offerPrice": 166 },
      { "weight": "500g", "mrp": 340, "offerPercent": 10, "offerPrice": 306 },
      { "weight": "1000g", "mrp": 650, "offerPercent": 12, "offerPrice": 572 }
    ],
    "totalStock": "150",
    "barcode": "",
    "barcodeValue": "PR005",
    "rating": 3.8
  },
  {
    "productId": "PR006",
    "name": "Black Raisins",
    "description": "Naturally dried black raisins full of nutrients.",
    "healthBenefits": ["Good for digestion", "Iron rich"],
    "category": "Raisins",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 90, "offerPercent": 5, "offerPrice": 86 },
      { "weight": "250g", "mrp": 200, "offerPercent": 10, "offerPrice": 180 },
      { "weight": "500g", "mrp": 380, "offerPercent": 12, "offerPrice": 334 },
      { "weight": "1000g", "mrp": 720, "offerPercent": 15, "offerPrice": 612 }
    ],
    "totalStock": "110",
    "barcode": "",
    "barcodeValue": "PR006",
    "rating": 4
  },
  {
    "productId": "PR007",
    "name": "Golden Raisins",
    "description": "Sweet golden raisins with premium quality.",
    "healthBenefits": ["Boosts energy", "Improves digestion"],
    "category": "Raisins",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 100, "offerPercent": 5, "offerPrice": 95 },
      { "weight": "250g", "mrp": 220, "offerPercent": 10, "offerPrice": 198 },
      { "weight": "500g", "mrp": 420, "offerPercent": 12, "offerPrice": 370 },
      { "weight": "1000g", "mrp": 800, "offerPercent": 15, "offerPrice": 680 }
    ],
    "totalStock": "95",
    "barcode": "",
    "barcodeValue": "PR007",
    "rating": 3.5
  },
  {
    "productId": "PR008",
    "name": "Chia Seeds",
    "description": "Organic chia seeds rich in fiber and omega-3.",
    "healthBenefits": ["Weight loss", "Heart health"],
    "category": "Seeds",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 120, "offerPercent": 10, "offerPrice": 108 },
      { "weight": "250g", "mrp": 280, "offerPercent": 12, "offerPrice": 246 },
      { "weight": "500g", "mrp": 520, "offerPercent": 15, "offerPrice": 442 },
      { "weight": "1000g", "mrp": 950, "offerPercent": 18, "offerPrice": 779 }
    ],
    "totalStock": "85",
    "barcode": "",
    "barcodeValue": "PR008",
    "rating": 4.6
  },
  {
    "productId": "PR009",
    "name": "Flax Seeds",
    "description": "Natural flax seeds rich in fiber and nutrients.",
    "healthBenefits": ["Improves digestion", "Heart health"],
    "category": "Seeds",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 70, "offerPercent": 5, "offerPrice": 67 },
      { "weight": "250g", "mrp": 160, "offerPercent": 8, "offerPrice": 147 },
      { "weight": "500g", "mrp": 300, "offerPercent": 10, "offerPrice": 270 },
      { "weight": "1000g", "mrp": 550, "offerPercent": 12, "offerPrice": 484 }
    ],
    "totalStock": "130",
    "barcode": "",
    "barcodeValue": "PR009",
    "rating": 3.9
  },
  {
    "productId": "PR010",
    "name": "Mixed Dry Fruits",
    "description": "Blend of nuts, raisins and seeds.",
    "healthBenefits": ["Balanced nutrition", "Energy booster"],
    "category": "Dry Fruits",
    "images": [],
    "variants": [
      { "weight": "100g", "mrp": 200, "offerPercent": 10, "offerPrice": 180 },
      { "weight": "250g", "mrp": 450, "offerPercent": 12, "offerPrice": 396 },
      { "weight": "500g", "mrp": 850, "offerPercent": 15, "offerPrice": 723 },
      { "weight": "1000g", "mrp": 1600, "offerPercent": 18, "offerPrice": 1312 }
    ],
    "totalStock": "60",
    "barcode": "",
    "barcodeValue": "PR010",
    "rating": 5
  }
];

async function seedProducts() {
  try {
    for (const prod of products) {
      const [existing] = await db.query('SELECT id FROM products WHERE productId = ?', [prod.productId]);
      if (existing.length === 0) {
        // Convert stock to grams (assuming the input is KG)
        const stockGrams = Number(prod.totalStock) * 1000;
        
        await db.query(
          'INSERT INTO products (productId, name, description, healthBenefits, category, rating, barcode, barcodeValue, images, variants, totalStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            prod.productId, 
            prod.name, 
            prod.description, 
            JSON.stringify(prod.healthBenefits || []), 
            prod.category, 
            prod.rating, 
            prod.barcode || '', 
            prod.barcodeValue || '', 
            JSON.stringify(prod.images || []), 
            JSON.stringify(prod.variants || []), 
            stockGrams
          ]
        );
        console.log(`Inserted product: ${prod.name}`);
      } else {
        console.log(`Product already exists: ${prod.name}`);
      }
    }
    console.log('Product seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Product seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
