const express = require('express');
const router = express.Router();
const contactFormController = require('../controllers/contactFormController');

router.get('/', contactFormController.getContactSubmissions);
router.post('/', contactFormController.createContactSubmission);

module.exports = router;
