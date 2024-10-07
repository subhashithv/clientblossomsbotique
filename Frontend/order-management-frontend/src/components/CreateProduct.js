import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload } from 'react-icons/fa'; // Import upload icon



const CreateProduct = () => {
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
    colors: [], // This should remain as an array
    tags: [],   // This should remain as an array
  });

  const [image, setImage] = useState(null); // State for storing image

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For colors and tags, we want to maintain them as arrays
    if (name === 'colors' || name === 'tags') {
      const values = value.split(',').map(item => item.trim());
      setProduct({ ...product, [name]: values });
    } else {
      setProduct({ ...product, [name]: value });
    }
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
    
    // Append colors and tags as JSON strings
    formData.append('colors', JSON.stringify(product.colors)); // Convert to JSON
    formData.append('tags', JSON.stringify(product.tags));     // Convert to JSON

    // Append the image file if it exists
    if (product.imageFile) {
      formData.append('image', product.imageFile);
    }

    // Set API URL for creating a product
    const apiUrl = `${process.env.REACT_APP_API_URL}/products`;

    axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
      }
    })
      .then(() => {
        toast.success('Product created successfully!'); // Show success message

        // Add delay before redirect to allow user to see toast
        setTimeout(() => {
          // Clear the form after creation
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
          navigate('/'); // Navigate back to product list after 2 seconds
        }, 2000); // Delay for 2 seconds
      })
      .catch(error => {
        console.error('Error creating product:', error);
        toast.error('Error creating product'); // Show error message
      });
  };

  return (
    <div className="main-content">
      <ToastContainer /> {/* ToastContainer to render toasts */}
      
      <div className="header">
        <h1 className="header-title">Add New Product</h1>
      </div>

      <div className="general-info-container">
        <h2>General Information</h2>
        <form onSubmit={handleSubmit} className="product-form">

          {/* Left Half */}
          <div className="left-half">
            <div className="form-section">
              <label>Product Name</label>
              <input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Enter product name" required />
            </div>

            <div className="form-section">
              <label>Description</label>
              <textarea className="description-textarea" name="description" value={product.description} onChange={handleInputChange} placeholder="Enter product description" required />
            </div>

            <div className="form-section">
              <label>Material & Core</label>
              <input type="text" name="material" value={product.material} onChange={handleInputChange} placeholder="Enter material & core" required />
            </div>

            <div className="form-section">
              <label>Basic Price</label>
              <input type="number" name="price" value={product.price} onChange={handleInputChange} placeholder="Enter basic price" required />
            </div>

            <div className="form-section small-input">
              <label>Discount Percentage</label>
              <input type="number" name="discountPercentage" value={product.discountPercentage} onChange={handleInputChange} placeholder="Enter discount percentage" />
            </div>

            <div className="form-section small-input">
              <label>Discount Type</label>
              <input type="text" name="discountType" value={product.discountType} onChange={handleInputChange} placeholder="Type fixed / percentage" />
            </div>

            <div className="form-section">
              <label>Quantity</label>
              <input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} placeholder="Enter product quantity" required />
            </div>
          </div>

          {/* Right Half */}
          <div className="right-half">
            <div className="form-section image-upload-box">
              <label htmlFor="file-upload" className="custom-file-upload">
                {image ? (
                  <img src={image} alt="Uploaded Preview" style={{ width: '200px', height: '200px' }} />
                ) : (
                  <>
                    <FaUpload className="upload-icon" style={{ fontSize: '24px' }} />
                    <p>Upload Photo</p>
                  </>
                )}
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            <div className="form-section product-category">
              <label>Product Category</label>
              <input type="text" name="category" value={product.category} onChange={handleInputChange} placeholder="Enter product category" required />
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
                value={product.colors.join(', ')}
                onChange={handleInputChange}
                placeholder="Enter colors separated by commas (red,green,yellow)"
              />
            </div>

            <div className="form-section product-tags">
              <label>Product Tags</label>
              <input
                type="text"
                name="tags"
                value={product.tags.join(', ')}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
            </div>
            
            <div className="button-container">
              <button type="submit" className="save-btn">Create Product</button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct; 

