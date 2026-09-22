const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const comboController = require('../controllers/comboController');
const reviewController = require('../controllers/reviewController');

const comboUploadDir = path.join(__dirname, '../../uploads/combos');
fs.mkdirSync(comboUploadDir, { recursive: true });

const getCanonicalImageExtension = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	if (mimeType === 'image/png') return '.png';
	if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return '.jpeg';
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	if (['png'].includes(extension)) return '.png';
	if (['jpg', 'jpeg'].includes(extension)) return '.jpeg';
	return '.jpeg';
};

const isAllowedComboImage = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	return ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType) || ['jpg', 'jpeg', 'png'].includes(extension);
};

const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, comboUploadDir),
		filename: (_req, file, cb) => cb(null, `combo-${Date.now()}-${Math.round(Math.random() * 1e9)}${getCanonicalImageExtension(file)}`),
	}),
	limits: { files: 10, fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (isAllowedComboImage(file)) return cb(null, true);
		cb(new Error('Only JPEG and PNG images are allowed for combo uploads.'));
	},
});

router.get('/', comboController.getCombos);
router.post('/', upload.array('images', 10), comboController.addCombo);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', upload.array('images', 10), comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;
