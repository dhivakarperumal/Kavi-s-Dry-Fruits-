const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

test('cart routes authorize the userId route parameter', async () => {
  const auth = require('../src/middleware/auth');
  const controllerPath = require.resolve('../src/controllers/cartController');
  const routerPath = require.resolve('../src/routers/cartRoutes');
  const originalAuthenticate = auth.authenticate;
  const originalController = require.cache[controllerPath];

  auth.authenticate = (req, res, next) => {
    req.user = { userId: 1, userUuid: 'test-user-uuid', role: 'user' };
    next();
  };
  require.cache[controllerPath] = {
    id: controllerPath,
    filename: controllerPath,
    loaded: true,
    exports: Object.fromEntries([
      'getCart',
      'addToCart',
      'updateQuantity',
      'updateWeight',
      'removeCartItem',
      'clearCart',
    ].map((handler) => [handler, (req, res) => res.sendStatus(204)])),
  };

  try {
    const app = express();
    app.use('/api/cart', require('../src/routers/cartRoutes'));
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));

    try {
      const baseUrl = `http://127.0.0.1:${server.address().port}/api/cart`;
      const ownCart = await fetch(`${baseUrl}/test-user-uuid`);
      const anotherUsersCart = await fetch(`${baseUrl}/another-user-uuid`);
      const addToOwnCart = await fetch(`${baseUrl}/test-user-uuid`, { method: 'POST' });

      assert.equal(ownCart.status, 204);
      assert.equal(anotherUsersCart.status, 403);
      assert.equal(addToOwnCart.status, 204);
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  } finally {
    auth.authenticate = originalAuthenticate;
    delete require.cache[routerPath];
    if (originalController) require.cache[controllerPath] = originalController;
    else delete require.cache[controllerPath];
  }
});
