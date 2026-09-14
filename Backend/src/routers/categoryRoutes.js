const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const categoryController = require('../controllers/categoryController');

const categoryUploadDir = path.join(__dirname, '../../uploads/categories');
fs.mkdirSync(categoryUploadDir, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, categoryUploadDir),
	filename: (_req, file, cb) => {
		const extension = path.extname(file.originalname).toLowerCase();
		cb(null, `category-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
	},
});

const upload = multer({
	storage,
	limits: { files: 10, fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		cb(null, file.mimetype.startsWith('image/'));
	},
});

router.get('/', categoryController.getCategories);
router.post('/', upload.array('images', 10), categoryController.addCategory);
router.put('/:id', upload.array('images', 10), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
