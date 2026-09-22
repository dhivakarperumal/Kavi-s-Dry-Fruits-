const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const categoryController = require('../controllers/categoryController');

const categoryUploadDir = path.join(__dirname, '../../uploads/categories');
fs.mkdirSync(categoryUploadDir, { recursive: true });

const getCanonicalImageExtension = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	if (mimeType === 'image/png') return '.png';
	if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return '.jpeg';
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	if (['png'].includes(extension)) return '.png';
	if (['jpg', 'jpeg'].includes(extension)) return '.jpeg';
	return '.jpeg';
};

const isAllowedCategoryImage = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	return ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType) || ['jpg', 'jpeg', 'png'].includes(extension);
};

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, categoryUploadDir),
	filename: (_req, file, cb) => {
		cb(null, `category-${Date.now()}-${Math.round(Math.random() * 1e9)}${getCanonicalImageExtension(file)}`);
	},
});

const upload = multer({
	storage,
	limits: { files: 10, fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (isAllowedCategoryImage(file)) return cb(null, true);
		cb(new Error('Only JPEG and PNG images are allowed for category uploads.'));
	},
});

router.get('/', categoryController.getCategories);
router.post('/', upload.array('images', 10), categoryController.addCategory);
router.put('/:id', upload.array('images', 10), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
