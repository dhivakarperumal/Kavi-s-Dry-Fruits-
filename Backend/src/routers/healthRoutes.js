const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getHealthBenefits, createHealthBenefit, updateHealthBenefit, deleteHealthBenefit } = require('../controllers/healthController');
const router = express.Router();

const imageUploadDir = path.join(__dirname, '../../uploads/health-benefits/images');
const videoUploadDir = path.join(__dirname, '../../uploads/health-benefits/videos');
fs.mkdirSync(imageUploadDir, { recursive: true });
fs.mkdirSync(videoUploadDir, { recursive: true });

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => cb(null, file.fieldname === 'videoFiles' ? videoUploadDir : imageUploadDir),
		filename: (req, file, cb) => {
			const extension = path.extname(file.originalname).toLowerCase();
			const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'media';
			cb(null, `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`);
		}
	}),
	limits: { fileSize: 50 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const isVideo = file.fieldname === 'videoFiles';
		const valid = isVideo ? file.mimetype.startsWith('video/') : file.mimetype.startsWith('image/');
		cb(valid ? null : new Error(`Invalid ${isVideo ? 'video' : 'image'} file`), valid);
	}
});

router.get('/', getHealthBenefits);
router.post('/', upload.fields([{ name: 'images', maxCount: 20 }, { name: 'videoFiles', maxCount: 20 }]), createHealthBenefit);
router.put('/:id', upload.fields([{ name: 'images', maxCount: 20 }, { name: 'videoFiles', maxCount: 20 }]), updateHealthBenefit);
router.delete('/:id', deleteHealthBenefit);

module.exports = router;
