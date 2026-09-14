const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');

router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
