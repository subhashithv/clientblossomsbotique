import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [shippingDetails, setShippingDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [showShippingForm, setShowShippingForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const apiUrl = `${process.env.REACT_APP_API_URL}/allorders`;
  const searchUrl = `${process.env.REACT_APP_API_URL}/orders/search`;

  const fetchOrders = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${searchUrl}?query=${query}` : apiUrl;
      const response = await axios.get(url);
      setOrders(response.data);
      await fetchProducts(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, searchUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchProducts = async (orders) => {
    try {
      const productPromises = orders.map(order =>
        axios.get(`${process.env.REACT_APP_API_URL}/orders/${order._id}`)
      );

      const productResponses = await Promise.all(productPromises);
      const productDetails = productResponses.reduce((acc, res) => {
        acc[res.data._id] = res.data;
        return acc;
      }, {});
      setProducts(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchOrders(query);
  };

  const handleShippingDetailsChange = (orderId, field, value) => {
    setShippingDetails(prevState => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        [field]: value
      }
    }));
  };

  const handleConfirmShipping = async (orderId) => {
    const orderShippingDetails = shippingDetails[orderId];

    if (!orderShippingDetails || !orderShippingDetails.shippingID || !orderShippingDetails.estimatedDelivery) {
      alert('Please enter both Shipping ID and Estimated Delivery Date.');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/shipping`, {
        shippingStatus: 'Shipped',
        shippingID: orderShippingDetails.shippingID,
        estimatedDeliveryDate: orderShippingDetails.estimatedDelivery
      });
      toast.success('Shipping details updated successfully!');
      setShowShippingForm(prevState => ({ ...prevState, [orderId]: false }));

      // Refresh the orders list after confirmation
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error updating shipping details:', error);
      alert('Failed to update shipping details.');
    }
  };

  const handleCancelShipping = (orderId) => {
    setShowShippingForm(prevState => ({ ...prevState, [orderId]: false }));
  };

  const getButtonStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#4CAF50', color: 'white' }; // Green
      case 'Shipped':
        return { backgroundColor: 'orange', color: 'white' }; // Orange
      case 'Delivered':
        return { backgroundColor: 'lightgreen', color: 'white' }; // Light Green
      case 'Issues':
        return { backgroundColor: 'red', color: 'white' }; // Red
      default:
        return {};
    }
  };

  const sortedOrders = orders.sort((a, b) => {
    const statusPriority = {
      Issues: 1,    // Highest priority
      Pending: 2,
      Shipped: 3,
      Delivered: 4  // Lowest priority
    };
  
    const statusA = a.primaryInfo.shippingStatus;
    const statusB = b.primaryInfo.shippingStatus;
  
    return statusPriority[statusA] - statusPriority[statusB];
  });
  
  return (
    <div className="main-content">
      <ToastContainer />
      <div className="header">
        <h1 className="header-title">Orders</h1>
        <div className="search-controls">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search by Product, Customer Name or Email"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      <div className="order-list">
        {loading ? (
          <p>Loading orders...</p>
        ) : sortedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          sortedOrders.map(order => {
            const product = products[order._id];
            const imageUrl = product?.primaryInfo?.imageUrl;

            return (
              <div key={order._id} className="order-card">
                <div className="order-column left-column">
                  {product ? (
                    <div className="order-details">
                      <img
                        src={imageUrl ? `http://localhost:5000${imageUrl}` : 'https://via.placeholder.com/150'}
                        alt={order.primaryInfo.productName}
                        className="order-image"
                      />
                      <div className="order-info">
                        <h3>{order.primaryInfo.productName}</h3>
                        <p>{order.primaryInfo.productCategory}</p>
                        <p>₹{order.primaryInfo.price}</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ) : (
                    <p>Loading product details...</p>
                  )}
                </div>

                <div className="order-column middle-column">
                  <div className="contact-info">
                    <p>
                      <FaUser /> {order.primaryInfo.customerName}
                    </p>
                    <p>
                      <FaEnvelope /> {order.secondaryInfo.customerEmail}
                    </p>
                    <p>
                      <FaPhone /> {order.secondaryInfo.customerPhone}
                    </p>
                    <p>
                      <FaMapMarkerAlt /> {order.secondaryInfo.city}, {order.secondaryInfo.address}
                    </p>
                  </div>
                </div>

                <div className="order-column right-column">
                  {showShippingForm[order._id] ? (
                    <div className="shipping-form">
                      <input
                        type="text"
                        placeholder="Enter Shipping ID"
                        value={shippingDetails[order._id]?.shippingID || ''}
                        onChange={e => handleShippingDetailsChange(order._id, 'shippingID', e.target.value)}
                      />
                      {/* Calendar input for estimated delivery date */}
                      <input
                        type="date"
                        placeholder="Estimated Delivery Date"
                        value={shippingDetails[order._id]?.estimatedDelivery || ''}
                        onChange={e => handleShippingDetailsChange(order._id, 'estimatedDelivery', e.target.value)}
                      />
                      <button
                        className="button confirm-button"
                        onClick={() => handleConfirmShipping(order._id)}>Confirm</button>
                      <button
                        className="button cancel-button"
                        onClick={() => handleCancelShipping(order._id)}>Cancel</button>
                    </div>
                  ) : (
                    <button
                      style={getButtonStyle(order.primaryInfo.shippingStatus)}
                      onClick={() => {
                        if (order.primaryInfo.shippingStatus === 'Pending') {
                          setShowShippingForm(prevState => ({ ...prevState, [order._id]: true }));
                        }
                      }}
                    >
                      {order.primaryInfo.shippingStatus}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderList;
