import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import EditProduct from './components/EditProduct'; // Import the EditProduct page
import CreateProduct from './components/CreateProduct'; // Import the CreateProduct page
import OrderList from './components/OrderList'; // Import the OrderList component
import Dashboard from './components/Dashboard'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/edit-product/:id" element={<EditProduct />} /> {/* Edit Product Route */}
          <Route path="/create-product" element={<CreateProduct />} /> {/* New Create Product Route */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* New Dashboard route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
