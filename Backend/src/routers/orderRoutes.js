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
const router = express.Router();

// Specific routes MUST come before wildcard /:id routes
router.get('/user/:userId', getUserOrders);
router.post('/location/update', updateLocation);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/:id/tracking', getOrderTracking);
router.get('/:id/location', getOrderLocation);

module.exports = router;
