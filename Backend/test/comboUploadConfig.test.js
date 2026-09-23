const test = require('node:test');
const assert = require('node:assert/strict');

const { MAX_COMBO_IMAGES, MAX_COMBO_IMAGE_SIZE_BYTES, isAllowedComboImage } = require('../src/config/comboUpload');

test('combo upload config enforces 20 images and 5MB per file', () => {
  assert.equal(MAX_COMBO_IMAGES, 20);
  assert.equal(MAX_COMBO_IMAGE_SIZE_BYTES, 5 * 1024 * 1024);
});

test('combo upload accepts only JPG, JPEG, and PNG files', () => {
  assert.equal(isAllowedComboImage({ mimetype: 'image/jpeg', originalname: 'combo-1.jpg' }), true);
  assert.equal(isAllowedComboImage({ mimetype: 'image/png', originalname: 'combo-2.png' }), true);
  assert.equal(isAllowedComboImage({ mimetype: 'image/webp', originalname: 'combo-3.webp' }), false);
});
