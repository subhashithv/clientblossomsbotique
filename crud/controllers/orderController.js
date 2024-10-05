const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
    const { primaryInfo, secondaryInfo } = req.body;

    try {
        // Ensure the primaryInfo and secondaryInfo are included
        const newOrder = new Order({
            primaryInfo: primaryInfo,
            secondaryInfo: secondaryInfo
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err });
    }
};



// Get all orders
const getAllOrders = async (req, res) => {
  try {
      const orders = await Order.find({});
      res.json(orders);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

// Get orders by shipping status
const getOrdersByShippingStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const orders = await Order.find({ "primaryInfo.shippingStatus": status });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders by shipping status' });
    }
};

// Get order by MongoDB _id
const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order' });
    }
};
// Update order's shipping status and details
const updateOrderShipping = async (req, res) => {
    const orderId = req.params.id;
    const { shippingStatus, shippingDetails } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    "primaryInfo.shippingStatus": shippingStatus,
                    "primaryInfo.shippingDetails": shippingDetails
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error });
    }
};


const searchOrders = async (req, res) => {
    const { query } = req.query; // Get the search query from the request

    // Log the query to see what is being received
    console.log('Search Query:', query); 

    if (!query) {
        return res.status(400).json({ message: 'Query cannot be empty' });
    }

    try {
        // Construct a regex pattern to search
        const regex = new RegExp(query, 'i'); // Case-insensitive search

        // Search for orders that match the query in product name, customer name, or email
        const orders = await Order.find({
            $or: [
                { 'primaryInfo.productName': regex },
                { 'primaryInfo.customerName': regex },
                { 'secondaryInfo.customerEmail': regex }
            ]
        });

        console.log('Orders Found:', orders); // Log the found orders
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error searching for orders:', err); // Log the error for debugging
        res.status(500).json({ message: 'Error searching for orders', error: err.message });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByShippingStatus,
    getOrderById,
    deleteOrder,
    updateOrderShipping,
    searchOrders, // Export the new search method
};


