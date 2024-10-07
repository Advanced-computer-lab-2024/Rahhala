import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const CreateProduct = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context

    let homePath;
    if (auth.user && auth.user.type === 'admin') {
        homePath = '/AdminDashboard';
    }
    else if(auth.user && auth.user.type === 'seller'){
        homePath = '/seller-dashboard';
    }
  const [product, setProduct] = useState({
    picture: '',
    price: '',
    name: '',
    description: '',
    sellerName: '',
    averageRating: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/createProduct', product);
      console.log('Product created:', response.data);
      navigate(homePath);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Picture URL:</label>
          <input type="text" name="picture" value={product.picture} onChange={handleChange} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={product.description} onChange={handleChange} />
        </div>
        <div>
          <label>Seller Name:</label>
          <input type="text" name="sellerName" value={product.sellerName} onChange={handleChange} required />
        </div>
        <div>
          <label>Average Rating:</label>
          <input type="number" name="averageRating" value={product.averageRating} onChange={handleChange} />
        </div>
        <button type="submit">Create Product</button>
      </form>
      <NavigateButton path={homePath} text='Home' />
    </div>
  );
};

export default CreateProduct