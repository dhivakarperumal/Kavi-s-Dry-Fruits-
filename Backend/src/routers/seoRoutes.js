const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

router.get('/', seoController.getSEOKeywords);
router.get('/:id', seoController.getSEOKeywordById);
router.post('/', seoController.addSEOKeywords);
router.put('/:id', seoController.updateSEOKeyword);
router.delete('/:id', seoController.deleteSEOKeyword);

module.exports = router;