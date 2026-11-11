const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

test('favorite routes authorize the userId route parameter', async () => {
  const auth = require('../src/middleware/auth');
  const controllerPath = require.resolve('../src/controllers/favoriteController');
  const routerPath = require.resolve('../src/routers/favoriteRoutes');
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
      'getFavorites',
      'addToFavorites',
      'removeFavoriteItem',
      'clearWishlist',
    ].map((handler) => [handler, (req, res) => res.sendStatus(204)])),
  };

  try {
    const app = express();
    app.use('/api/favorites', require('../src/routers/favoriteRoutes'));
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));

    try {
      const baseUrl = `http://127.0.0.1:${server.address().port}/api/favorites`;
      const ownFavorites = await fetch(`${baseUrl}/test-user-uuid`);
      const anotherUsersFavorites = await fetch(`${baseUrl}/another-user-uuid`);
      const addToOwnFavorites = await fetch(`${baseUrl}/test-user-uuid`, { method: 'POST' });
      const removeOwnFavorite = await fetch(`${baseUrl}/test-user-uuid/product-1`, { method: 'DELETE' });
      const clearOwnFavorites = await fetch(`${baseUrl}/test-user-uuid`, { method: 'DELETE' });

      assert.equal(ownFavorites.status, 204);
      assert.equal(anotherUsersFavorites.status, 403);
      assert.equal(addToOwnFavorites.status, 204);
      assert.equal(removeOwnFavorite.status, 204);
      assert.equal(clearOwnFavorites.status, 204);
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
