import React, { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ReactComponent as ProductLogo } from '../assets/blackproduct.svg';
import { ReactComponent as OrderLogo } from '../assets/order.svg';

// Register components for Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [shippedOrders, setShippedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [issueOrders, setIssueOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false); // State to toggle low-stock view
  const [salesData, setSalesData] = useState([]); // State for sales data

  // Fetch orders and products from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/allorders');
        const data = await response.json();
        setOrders(data);
        setTotalOrders(data.length);

        // Count order statuses
        const shippedCount = data.filter(order => order.primaryInfo.shippingStatus === 'Shipped').length;
        const deliveredCount = data.filter(order => order.primaryInfo.shippingStatus === 'Delivered').length;
        const issueCount = data.filter(order => order.primaryInfo.shippingStatus === 'Issues').length;

        setShippedOrders(shippedCount);
        setDeliveredOrders(deliveredCount);
        setIssueOrders(issueCount);

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

    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales-data');
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchLowStockProducts(); // Fetch low-stock products separately
    fetchSalesData(); // Fetch sales data
  }, []);

  // Toggle display of low stock products
  const handleViewLowStock = () => {
    setShowLowStock(!showLowStock);
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: salesData.map(data => data.month), // Use month names
    datasets: [
      {
        label: 'Orders Count',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: salesData.map(data => data.orderCount), // Use order counts
      },
    ],
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
      <OrderLogo />
      <h3>Total Orders</h3>
      <hr style={{ border: '1px solid black', margin: '20px 0' }} />
    </div>
    <p>{totalOrders}</p>
    <div className="order-statuses">
      <p>Shipped: {shippedOrders}</p>
      <p>Delivered: {deliveredOrders}</p>
      <p>Issues: {issueOrders}</p>
    </div>
  </div>
  <div className="summary-box">
    <div className="summary-box-header">
      <ProductLogo />
      <h3>Total Products</h3>
      <hr style={{ border: '1px solid black', margin: '20px 0' }} />
    </div>
    <p>{totalProducts}</p>
  </div>
  <div className="summary-box">
    <div className="summary-box-header">
      <h3>Stock Management</h3>
      <hr style={{ border: '1px solid black', margin: '20px 0' }} />
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
