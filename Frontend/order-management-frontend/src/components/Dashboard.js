import React, { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ReactComponent as ProductLogo } from '../assets/blackproduct.svg';
import { ReactComponent as Orderlogo } from '../assets/order.svg';

// Register components for Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false); // State to toggle low-stock view

  // Fetch orders and products from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/allorders');
        const data = await response.json();
        setOrders(data);
        setTotalOrders(data.length);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setTotalProducts(data.length);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/low-stock');
        const data = await response.json();
        setLowStockProducts(data);
      } catch (error) {
        console.error('Error fetching low-stock products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchLowStockProducts(); // Fetch low-stock products separately
  }, []);

  // Toggle display of low stock products
  const handleViewLowStock = () => {
    setShowLowStock(!showLowStock);
  };

  // Dummy data for bar chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Modify or fetch dynamically
    datasets: [
      {
        label: 'Purchases',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [45, 59, 70, 81, 56, 55] // Static data for the chart
      }
    ]
  };

  return (
    <div className="dashboard-container">
      {/* Header with Dashboard title and View Shop button */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="view-shop-btn">View Shop</button>
      </div>

      <div className="summary-boxes">
  <div className="summary-box">
    <div className="summary-box-header">
      <Orderlogo/>
      <h3>Total Orders</h3>
    </div>
    <p>{totalOrders}</p>
  </div>
  <div className="summary-box">
    <div className="summary-box-header">
      <ProductLogo/>
      <h3>Total Products</h3>
    </div>
    <p>{totalProducts}</p>
  </div>
  <div className="summary-box">
    <div className="summary-box-header">
      <ProductLogo/>
      <h3>Stock Management</h3>
    </div>
    <p>{lowStockProducts.length} low-stock items</p>
          <button className="view-low-stock-btn" onClick={handleViewLowStock}>
            {showLowStock ? 'Hide' : 'View'}
          </button>
        </div>
      </div>

      {showLowStock && (
        <div className="low-stock-products">
          <h3>Low Stock Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(lowStockProducts) && lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.size}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No low-stock products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart section */}
      <div className="chart-section">
        <h3>Purchases Overview</h3>
        <Bar data={chartData} />
      </div>

      {/* Recent orders */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.primaryInfo.productName}</td>
                <td>{order.primaryInfo.customerName}</td>
                <td>{order.primaryInfo.quantity}</td>
                <td>{order.primaryInfo.shippingStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
