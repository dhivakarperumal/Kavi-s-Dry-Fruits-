const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const comboController = require('../controllers/comboController');
const reviewController = require('../controllers/reviewController');

const comboUploadDir = path.join(__dirname, '../../uploads/combos');
fs.mkdirSync(comboUploadDir, { recursive: true });
const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, comboUploadDir),
		filename: (_req, file, cb) => cb(null, `combo-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
	}),
	limits: { files: 10, fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

router.get('/', comboController.getCombos);
router.post('/', upload.array('images', 10), comboController.addCombo);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', upload.array('images', 10), comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;
