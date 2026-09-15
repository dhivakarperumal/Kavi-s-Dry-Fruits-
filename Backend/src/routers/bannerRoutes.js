const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bannerController = require('../controllers/bannerController');

const router = express.Router();
const bannerUploadDir = path.join(__dirname, '../../uploads/banners');
fs.mkdirSync(bannerUploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, bannerUploadDir),
    filename: (_req, file, cb) => cb(null, `banner-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

router.get('/', bannerController.getBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/upload', upload.single('image'), bannerController.uploadBannerImage);
router.post('/', bannerController.addBanner);
router.put('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
