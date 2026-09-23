const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const comboController = require('../controllers/comboController');
const reviewController = require('../controllers/reviewController');
const {
  MAX_COMBO_IMAGES,
  MAX_COMBO_IMAGE_SIZE_BYTES,
  getCanonicalImageExtension,
  isAllowedComboImage,
} = require('../config/comboUpload');

const comboUploadDir = path.join(__dirname, '../../uploads/combos');
fs.mkdirSync(comboUploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, comboUploadDir),
    filename: (_req, file, cb) => cb(null, `combo-${Date.now()}-${Math.round(Math.random() * 1e9)}${getCanonicalImageExtension(file)}`),
  }),
  limits: {
    files: MAX_COMBO_IMAGES,
    fileSize: MAX_COMBO_IMAGE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (isAllowedComboImage(file)) return cb(null, true);
    cb(new Error('Only JPG, JPEG, and PNG images are allowed for combo uploads.'));
  },
});

router.get('/', comboController.getCombos);
router.post('/', upload.array('images', 20), comboController.addCombo);
router.post('/:id/review', reviewController.addReview);
router.put('/:id', upload.array('images', 20), comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    const messageMap = {
      LIMIT_PART_COUNT: 'The request has too many multipart parts.',
      LIMIT_FILE_SIZE: `Each combo image must be 5 MB or smaller.`,
      LIMIT_FILE_COUNT: `You can upload up to ${MAX_COMBO_IMAGES} images only.`,
      LIMIT_UNEXPECTED_FILE: 'Unexpected file upload field received.',
    };
    return res.status(400).json({ message: messageMap[error.code] || error.message || 'Upload failed.' });
  }

  if (error) {
    return res.status(400).json({ message: error.message || 'Upload failed.' });
  }

  return next();
});

module.exports = router;
