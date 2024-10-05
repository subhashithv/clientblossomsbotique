// controllers/inventoryController.js
const Product = require('../models/Product');

// Purchase Product - updates stock quantity after a purchase
const purchaseProduct = async (req, res) => {
  try {
    const { id, purchaseQuantity } = req.body; // id of the product and the quantity purchased
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if sufficient stock is available
    if (product.quantity < purchaseQuantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Update the stock quantity
    product.quantity -= purchaseQuantity;
    await product.save();

    // Check if stock is below threshold
    if (product.quantity < 5) {
      console.log(`Low Stock Alert: The stock for ${product.name} is low. Only ${product.quantity} left in inventory.`);
    }

    res.status(200).json({ message: 'Purchase successful', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  purchaseProduct,
};
