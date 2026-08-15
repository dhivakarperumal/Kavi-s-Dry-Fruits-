const test = require('node:test');
const assert = require('node:assert/strict');

test('contact form controller and routes are available', () => {
  const controller = require('../src/controllers/contactFormController');
  const router = require('../src/routers/contactFormRoutes');

  assert.equal(typeof controller.getContactSubmissions, 'function');
  assert.equal(typeof controller.createContactSubmission, 'function');
  assert.ok(Array.isArray(router.stack));
  assert.ok(router.stack.some(layer => layer.route && layer.route.path === '/'));
});
