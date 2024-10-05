const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    primaryInfo: {
        customerName: { type: String, required: true },
        quantity: { type: Number, required: true },
        productId: { type: String, required: true },
        productName: { type: String, required: true }, // Add product name
        productCategory: { type: String, required: true }, // Add product category
        approved: { type: Boolean, default: false },
        shippingStatus: { type: String, default: 'Pending' },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
    },
    secondaryInfo: {
        customerEmail: { type: String, required: true },
        customerPhone: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        shippingID: { type: String, default: null },
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
