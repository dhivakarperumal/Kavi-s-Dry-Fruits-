const db = require('./Backend/src/config/db');
const crypto = require('crypto');

const createReviewId = () => {
    return 'REV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const reviews = [
  {
    "userName": "Arun Kumar",
    "comment": "Very fresh and premium quality dry fruits. Packaging was neat and delivery was quick. Definitely worth the price.",
    "image": "",
    "selected": true,
    "rating": 5
  },
  {
    "userName": "Priya Sharma",
    "comment": "Good quality products. Taste is really nice and fresh. Will order again for sure.",
    "image": "",
    "selected": false,
    "rating": 4
  },
  {
    "userName": "Rahul Verma",
    "comment": "Affordable and good for daily use. Quality is decent but packaging can improve.",
    "image": "",
    "selected": false,
    "rating": 3.5
  },
  {
    "userName": "Sneha Reddy",
    "comment": "Excellent combo packs. Loved the freshness and taste. Highly recommended!",
    "image": "",
    "selected": true,
    "rating": 5
  },
  {
    "userName": "Vikram Singh",
    "comment": "Good value for money. Products are fresh and clean. Happy with the purchase.",
    "image": "",
    "selected": false,
    "rating": 4.2
  },
  {
    "userName": "Meena Lakshmi",
    "comment": "Nice quality but expected slightly better packaging. Overall satisfied.",
    "image": "",
    "selected": false,
    "rating": 3.8
  },
  {
    "userName": "Karthik Raj",
    "comment": "Super fresh dry fruits. Taste is amazing and perfect for daily snacks.",
    "image": "",
    "selected": true,
    "rating": 5
  },
  {
    "userName": "Divya Nair",
    "comment": "Good product quality. Delivery was fast and packing was neat.",
    "image": "",
    "selected": false,
    "rating": 4.3
  },
  {
    "userName": "Ramesh Gupta",
    "comment": "Average quality. Not bad but not premium either. Okay for the price.",
    "image": "",
    "selected": false,
    "rating": 3.2
  },
  {
    "userName": "Anjali Patel",
    "comment": "Loved the combo pack. Perfect mix and very fresh products.",
    "image": "",
    "selected": true,
    "rating": 4.8
  },
  {
    "userName": "Suresh Babu",
    "comment": "Decent quality and good taste. Worth buying again.",
    "image": "",
    "selected": false,
    "rating": 4
  },
  {
    "userName": "Lakshmi Devi",
    "comment": "Nice freshness and flavor. Kids also liked it a lot.",
    "image": "",
    "selected": false,
    "rating": 4.5
  },
  {
    "userName": "Ajay Kumar",
    "comment": "Quality is okay. Expected a bit more premium feel.",
    "image": "",
    "selected": false,
    "rating": 3.5
  },
  {
    "userName": "Pooja Singh",
    "comment": "Very tasty and healthy. Perfect for daily consumption.",
    "image": "",
    "selected": true,
    "rating": 5
  },
  {
    "userName": "Manoj Yadav",
    "comment": "Good product with decent pricing. Delivery was on time.",
    "image": "",
    "selected": false,
    "rating": 4.1
  },
  {
    "userName": "Kavya Iyer",
    "comment": "Really impressed with the quality and freshness. Will recommend.",
    "image": "",
    "selected": true,
    "rating": 4.9
  },
  {
    "userName": "Deepak Sharma",
    "comment": "Average experience. Product is fine but nothing special.",
    "image": "",
    "selected": false,
    "rating": 3
  },
  {
    "userName": "Nisha Jain",
    "comment": "Great quality and hygienic packaging. Loved it.",
    "image": "",
    "selected": true,
    "rating": 4.7
  },
  {
    "userName": "Rohit Mehta",
    "comment": "Fresh and crunchy. Perfect for snacks and cooking.",
    "image": "",
    "selected": false,
    "rating": 4.4
  },
  {
    "userName": "Swathi K",
    "comment": "Good quality dry fruits at reasonable price. Satisfied purchase.",
    "image": "",
    "selected": false,
    "rating": 4.2
  }
];

async function seed() {
    console.log('Seeding reviews...');
    for (const review of reviews) {
        try {
            const reviewId = createReviewId();
            await db.query(
                'INSERT INTO reviews (reviewId, userName, comment, image, selected, rating) VALUES (?, ?, ?, ?, ?, ?)',
                [reviewId, review.userName, review.comment, review.image || null, review.selected || false, review.rating || 0]
            );
            console.log(`Added review from ${review.userName}`);
        } catch (error) {
            console.error(`Error adding review from ${review.userName}:`, error.message);
        }
    }
    console.log('Seeding completed!');
    process.exit(0);
}

seed();
