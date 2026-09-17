const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');

const productUploadDir = path.join(__dirname, '../../uploads/products');
fs.mkdirSync(productUploadDir, { recursive: true });

const imageExtensions = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
};

const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, productUploadDir),
		filename: (_req, file, cb) => cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${imageExtensions[file.mimetype]}`),
	}),
	limits: { files: 10, fileSize: 8 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => cb(null, Boolean(imageExtensions[file.mimetype])),
});

router.get('/', productController.getProducts);
router.post('/', upload.array('images', 10), productController.addProduct);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', upload.array('images', 10), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
