const test = require('node:test');
const assert = require('node:assert/strict');

test('contact form controller and routes are available', () => {
  const controller = require('../src/controllers/contactFormController');
  const router = require('../src/routers/contactFormRoutes');

  assert.equal(typeof controller.getContactSubmissions, 'function');
  assert.equal(typeof controller.createContactSubmission, 'function');
  assert.equal(typeof controller.normalizeContactSubmission, 'function');
  assert.ok(Array.isArray(router.stack));
  assert.ok(router.stack.some(layer => layer.route && layer.route.path === '/'));
});

test('normalizeContactSubmission maps website contact fields correctly', () => {
  const { normalizeContactSubmission } = require('../src/controllers/contactFormController');

  const result = normalizeContactSubmission({
    name: '  Test User ',
    email: '  test@example.com ',
    contact: '9876543210',
    address: ' Chennai ',
    message: ' Hello there ',
    subject: '  Query  '
  });

  assert.equal(result.name, 'Test User');
  assert.equal(result.email, 'test@example.com');
  assert.equal(result.phone, '9876543210');
  assert.equal(result.address, 'Chennai');
  assert.equal(result.message, 'Hello there');
  assert.equal(result.subject, 'Query');
});
