import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css'; 
import authController from '../../../backend/controllers/authController';

const Products = () => {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    const [products, setProducts] = useState(null);
    if(!auth.isAuthenticated) {
        navigate('/login');
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/products');
                setProducts(response.data.products);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProducts();
    }, []);

  return (
    <div>{products}</div>
  )
}

export default Products