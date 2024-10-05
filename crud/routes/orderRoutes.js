const express = require('express');
const { createOrder, getAllOrders,searchOrders, getOrdersByShippingStatus, getOrderById, deleteOrder, updateOrderShipping } = require('../controllers/orderController');
const router = express.Router();

// Route to create an order
router.post('/orders', createOrder);
router.get('/orders/search', searchOrders); // New search route

// Route to get all orders
router.get('/allorders', getAllOrders);

// Route to get orders by shipping status
router.get('/orders/shipping-status/:status', getOrdersByShippingStatus);

// Route to get an order by its MongoDB _id
router.get('/orders/:id', getOrderById); // New route to get an order by ID

// Route to delete an order by ID
router.delete('/orders/:id', deleteOrder);
router.get('/orders/shipping-status/:status', getOrdersByShippingStatus);
router.put('/orders/:id/shipping', updateOrderShipping);

module.exports = router;
