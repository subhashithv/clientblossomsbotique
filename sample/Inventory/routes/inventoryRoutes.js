// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { purchaseProduct } = require('../controllers/inventoryController');

// Route for purchasing a product
router.post('/purchase', purchaseProduct);

module.exports = router;
