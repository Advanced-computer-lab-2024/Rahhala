import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './CreateProduct.css';

const CreateProduct = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context

    let homePath;
    if (auth.user && auth.user.type === 'admin') {
        homePath = '/AdminDashboard';
    } else if (auth.user && auth.user.type === 'seller') {
        homePath = '/seller-dashboard';
    }

    const [product, setProduct] = useState({
        picture: '',
        price: '',
        name: '',
        description: '',
        sellerName: '',
        averageRating: 0,
        quantity: 1,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'price' || name === 'quantity') && value < 1) {
            setMessage('Price and Quantity must be at least 1.');
            return;
        }
        if (name === 'averageRating' && value < 0) {
            setMessage('Negative values are not allowed.');
            return;
        }
        setProduct({
            ...product,
            [name]: value,
        });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('api/product/create', product);
            console.log('Product created:', response.data);
            navigate(homePath);
        } catch (error) {
            console.error('Error creating product:', error);
            setMessage('Error creating product.');
        }
    };

    return (
        <div className="create-product">
            <h2>Create New Product</h2>
            {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
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
                    <label>Average Rating:</label>
                    <input type="number" name="averageRating" value={product.averageRating} onChange={handleChange} />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
                </div>
                <button type="submit">Create Product</button>
            </form>
            <div className="navigation-buttons">
                <NavigateButton path={homePath} text='Home' />
                <Logout />
            </div>
        </div>
    );
};

export default CreateProduct;