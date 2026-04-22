const express = require('express');
const { getOrders, createOrder, updateOrder, deleteOrder, getUserOrders } = require('../controllers/orderController');
const router = express.Router();

router.get('/', getOrders);
router.get('/user/:userId', getUserOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
