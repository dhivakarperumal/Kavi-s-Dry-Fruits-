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

const getCanonicalImageExtension = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	if (mimeType === 'image/png') return '.png';
	if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return '.jpeg';
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	if (['png'].includes(extension)) return '.png';
	if (['jpg', 'jpeg'].includes(extension)) return '.jpeg';
	return '.jpeg';
};

const isAllowedHealthImage = (file) => {
	const mimeType = String(file?.mimetype || '').toLowerCase();
	const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
	return ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType) || ['jpg', 'jpeg', 'png'].includes(extension);
};

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => cb(null, file.fieldname === 'videoFiles' ? videoUploadDir : imageUploadDir),
		filename: (req, file, cb) => {
			if (file.fieldname === 'videoFiles') {
				const extension = path.extname(file.originalname).toLowerCase();
				const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'media';
				cb(null, `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`);
				return;
			}

			const baseName = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'media';
			cb(null, `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${getCanonicalImageExtension(file)}`);
		}
	}),
	limits: { fileSize: 50 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const isVideo = file.fieldname === 'videoFiles';
		if (isVideo) {
			const valid = file.mimetype.startsWith('video/');
			return cb(valid ? null : new Error('Invalid video file'), valid);
		}
		const valid = isAllowedHealthImage(file);
		return cb(valid ? null : new Error('Only JPEG and PNG images are allowed for health benefit images.'), valid);
	}
});

router.get('/', getHealthBenefits);
router.post('/', upload.fields([{ name: 'images', maxCount: 20 }, { name: 'videoFiles', maxCount: 20 }]), createHealthBenefit);
router.put('/:id', upload.fields([{ name: 'images', maxCount: 20 }, { name: 'videoFiles', maxCount: 20 }]), updateHealthBenefit);
router.delete('/:id', deleteHealthBenefit);

module.exports = router;
