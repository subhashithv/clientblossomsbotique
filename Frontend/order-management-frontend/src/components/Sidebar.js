import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo.svg'; // Adjust the path according to your project structure
import { ReactComponent as Dashboard } from '../assets/Dashboard Icon.svg'; // Adjust the path according to your project structure
import { ReactComponent as Orderlogo } from '../assets/Frame.svg';
import { ReactComponent as ProductLogo } from '../assets/Product.svg'; // Adjust the path according to your project structure

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  return (
    <div className="sidebar">
      {/* Logo at the top */}
      <div className="sidebar-logo">
        <Logo />
      </div>
      <div className="sidebar-user">
        <div className="profile-image-placeholder"></div>
        <span>Harivarshan - 1</span>
      </div>

      {/* Sidebar items */}
      <Link to="/dashboard" className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <Dashboard />
        <span>Dashboard</span>
      </Link>
      
      <Link to="/orders" className={`sidebar-item ${location.pathname === '/orders' ? 'active' : ''}`}>
        <Orderlogo />
        <span>Orders</span>
      </Link>

      <Link to="/" className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
        <ProductLogo />
        <span>Products</span>
      </Link>

      {/* Logout Button */}
      <div className="logout-btn">
        <FaSignOutAlt className="logout-icon" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
