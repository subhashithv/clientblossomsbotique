import React, { useEffect, useState } from 'react';
import { FaSearch, FaPen, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const apiUrl = `${process.env.REACT_APP_API_URL}/products`;
  const baseUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = `${apiUrl}?search=${searchTerm}`;

        // Check if low-stock filter is active
        if (filters.includes('low-Stock')) {
          const response = await axios.get(`${apiUrl}/low-stock`); // Fetch low-stock products
          const productsWithDefaults = response.data.map(product => {
            const imageUrl = product.imageUrl ? `${baseUrl}${product.imageUrl.replace('/uploads/', '')}` : '';
            console.log(`Constructed image URL for low-stock product ${product._id}: ${imageUrl}`);
            return {
              ...product,
              colors: Array.isArray(product.colors) ? product.colors : [],
              imageUrl,
            };
          });
          setProducts(productsWithDefaults);
        } else {
          const response = await axios.get(query);
          const productsWithDefaults = response.data.map(product => {
            const imageUrl = product.imageUrl ? `${baseUrl}${product.imageUrl.replace('/uploads/', '')}` : '';
            return {
              ...product,
              colors: Array.isArray(product.colors) ? product.colors : [],
              imageUrl,
            };
          });
          setProducts(productsWithDefaults);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [apiUrl, searchTerm, filters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = (filter) => {
    setFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  console.log('Current products:', products);

  return (
    <div className="main-content">
      <div className="header">
        <h1 className="header-title">Products</h1>
        <div className="search-controls">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search 'Blue Saree'"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="search-icon" />
          </div>
          <Link to="/create-product">
            <button className="add-product-btn">+ Add Product</button>
          </Link>
        </div>
      </div>

      <div className="filters-container">
        <button className={`filter-btn ${filters.includes('low-Stock') ? 'active' : ''}`} onClick={() => toggleFilter('low-Stock')}>
          Low-Stock
        </button>
      </div>

      <div className="table-container">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Colors</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Edit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <React.Fragment key={product._id}>
                  <tr className="product-row">
                    <td>{product._id}</td>
                    <td>
                      <div className="product-image">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: '60px', height: 'auto' }}
                          onError={() => console.error(`Image failed to load: ${product.imageUrl}`)}
                        />
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{Array.isArray(product.colors) && product.colors.length > 0 ? product.colors.join(', ') : 'N/A'}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Link to={`/edit-product/${product._id}`}>
                        <button className="edit-btn">
                          <FaPen className="edit-icon" />
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                        <FaTrash className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="9"><hr /></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductList;
