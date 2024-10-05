// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountPercentage: { type: Number, default: 0 },
  color: { type: String },
  material: { type: String },
  core: { type: String },
  size: { type: String },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
