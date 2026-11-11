const express = require('express');
const { 
  getOrders, 
  getOrderById,
  createOrder, 
  updateOrder, 
  deleteOrder, 
  getUserOrders,
  getOrderTracking,
  updateLocation,
  getOrderLocation
} = require('../controllers/orderController');
const {
  authenticate,
  requireAdmin,
  authorizeSelfOrAdmin,
  authorizeOrderOwner,
} = require('../middleware/auth');
const router = express.Router();

// Specific routes MUST come before wildcard /:id routes
router.get('/user/:userId', authenticate, authorizeSelfOrAdmin(), getUserOrders);
router.post('/location/update', authenticate, requireAdmin, updateLocation);

router.get('/', authenticate, requireAdmin, getOrders);
router.post('/', authenticate, createOrder);
router.get('/:id/tracking', authenticate, authorizeOrderOwner, getOrderTracking);
router.get('/:id/location', authenticate, authorizeOrderOwner, getOrderLocation);
router.get('/:id', authenticate, authorizeOrderOwner, getOrderById);
router.put('/:id', authenticate, requireAdmin, updateOrder);
router.delete('/:id', authenticate, requireAdmin, deleteOrder);

module.exports = router;
