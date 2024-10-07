import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [product, setProduct] = useState({
    name: '',
    description: '',
    material: '',
    price: '',
    discountPercentage: '',
    discountType: '',
    quantity: '',
    category: '',
    size: '',
    colors: [],
    tags: [],
  });

  const [image, setImage] = useState(null); // State for storing image

  // Fetch product data if editing
  useEffect(() => {
    if (id) {
      console.log(`Fetching product with ID: ${id}`);
      axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`)
        .then(response => {
          console.log('Fetched product data:', response.data);
          setProduct(response.data);

          const baseUrl = 'http://localhost:5000/';
          // Ensure that imageUrl does not start with a leading slash
          const imageUrl = response.data.imageUrl ? response.data.imageUrl.replace(/^\/+/, '') : null; 
          const fetchedImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : null;

          console.log('Fetched image URL:', fetchedImageUrl); // Log fetched image URL
          setImage(fetchedImageUrl); // Set image state

          // Log the image state after setting
          console.log('Image state set to:', fetchedImageUrl);
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
          toast.error('Failed to fetch product data');
        });
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // For preview
      setProduct({ ...product, imageFile: file }); // Save the file for uploading
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('material', product.material);
    formData.append('price', product.price);
    formData.append('discountPercentage', product.discountPercentage);
    formData.append('discountType', product.discountType);
    formData.append('quantity', product.quantity);
    formData.append('category', product.category);
    formData.append('size', product.size);

    // Convert colors and tags arrays to JSON strings
    formData.append('colors', JSON.stringify(product.colors)); 
    formData.append('tags', JSON.stringify(product.tags)); 

    // Append the image file if it exists
    if (product.imageFile) {
      formData.append('image', product.imageFile);
    }

    // Determine the API endpoint and method based on whether we are editing or creating
    const apiUrl = id ? `${process.env.REACT_APP_API_URL}/products/${id}` : `${process.env.REACT_APP_API_URL}/products`; // Set URL
    const apiMethod = id ? axios.put : axios.post; // Determine method

    apiMethod(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
      }
    })
      .then(() => {
        const successMessage = id ? 'Product updated successfully!' : 'Product created successfully!';
        toast.success(successMessage); // Show success message
        if (!id) {
          // Clear the form if creating a new product
          setProduct({
            name: '',
            description: '',
            material: '',
            price: '',
            discountPercentage: '',
            discountType: '',
            quantity: '',
            category: '',
            size: '',
            colors: [],
            tags: [],
          });
          setImage(null); // Reset image
        }
        navigate('/'); // Navigate back to product list
      })
      .catch(error => {
        console.error('Error with product:', error);
        toast.error(`Error ${id ? 'updating' : 'creating'} product`); // Show error message
      });
  };

  return (
    <div className="main-content">
      <ToastContainer /> {/* ToastContainer to render toasts */}
      
      <div className="header">
        <h1 className="header-title">EditProduct</h1>

        <div className="search-controls">
          <div className="search-bar">
            <input className="search-input" type="text" placeholder="Search 'Blue Saree'" />
            <FaSearch className="search-icon" />
          </div>
          <button className="add-product-btn" onClick={() => navigate('/create-product')}>+ Add Product</button>
        </div>
      </div>

      <div className="general-info-container">
        <h2>General Information</h2>
        <form onSubmit={handleSubmit} className="product-form">

          {/* Left Half */}
          <div className="left-half">
            <div className="form-section">
              <label>Product Name</label>
              <input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Enter product name" />
            </div>

            <div className="form-section">
              <label>Description</label>
              <textarea className="description-textarea" name="description" value={product.description} onChange={handleInputChange} placeholder="Enter product description" />
            </div>

            <div className="form-section">
              <label>Material & Core</label>
              <input type="text" name="material" value={product.material} onChange={handleInputChange} placeholder="Enter material & core" />
            </div>

            <div className="form-section">
              <label>Basic Price</label>
              <input type="text" name="price" value={product.price} onChange={handleInputChange} placeholder="Enter basic price" />
            </div>

            <div className="form-section small-input">
              <label>Discount Percentage</label>
              <input type="text" name="discountPercentage" value={product.discountPercentage} onChange={handleInputChange} placeholder="Enter discount percentage" />
            </div>

            <div className="form-section small-input">
              <label>Discount Type</label>
              <input type="text" name="discountType" value={product.discountType} onChange={handleInputChange} placeholder="Type fixed / percentage" />
            </div>

            <div className="form-section">
              <label>Quantity</label>
              <input type="text" name="quantity" value={product.quantity} onChange={handleInputChange} placeholder="Enter product quantity" />
            </div>
          </div>

          {/* Right Half */}
          <div className="right-half">
            <div className="form-section image-upload-box">
              <label htmlFor="file-upload" className="custom-file-upload">
                {image ? (
                  <img src={image} alt="Uploaded Preview" style={{ width: '200px', height: '200px' }} />
                ) : (
                  'Click to upload an image'
                )}
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            <div className="form-section product-category">
              <label>Product Category</label>
              <input type="text" name="category" value={product.category} onChange={handleInputChange} placeholder="Enter product category" />
            </div>

            <div className="form-section product-size">
              <label>Size</label>
              <input type="text" name="size" value={product.size} onChange={handleInputChange} placeholder="Enter product size" />
            </div>
          
            <div className="form-section product-colors">
              <label>Product Colors</label>
              <input
                type="text"
                name="colors"
                value={Array.isArray(product.colors) ? product.colors.join(', ') : ''}
                onChange={(e) => {
                  const colors = e.target.value.trim();
                  if (colors) {
                    setProduct({ ...product, colors: colors.split(',').map(color => color.trim()) });
                  } else {
                    setProduct({ ...product, colors: [] }); // Set empty array when input is cleared
                  }
                }}
                placeholder="Enter colors separated by commas (red,green,yellow)"
              />
            </div>

            <div className="form-section product-tags">
              <label>Product Tags</label>
              <input
                type="text"
                name="tags"
                value={Array.isArray(product.tags) ? product.tags.join(', ') : ''}
                onChange={(e) => setProduct({ ...product, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                placeholder="Enter tags separated by commas"
              />
            </div>
{/* 
            <button type="submit" className="submit-btn">{id ? 'Update Product' : 'Add Product'}</button> */}
            <div className="button-container">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;
