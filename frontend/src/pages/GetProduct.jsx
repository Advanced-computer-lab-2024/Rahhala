import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const GetProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL parameters
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1); // State to hold the quantity to purchase
    const { auth } = useContext(AuthContext); // Get auth context
    let homePath;
    if (auth.user && auth.user.type === 'seller') {
        homePath = '/seller-dashboard';
    } else {
        homePath = '/products';
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/api/product/byId/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError(err.response.data.error);
            }
        };

        fetchProduct();
    }, [id]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const handlePurchase = async () => {
        try {
            await axiosInstance.post('/api/tourist/purchaseProduct', {
                productId: id,
                quantity: quantity
            });
            alert('Purchase successful!');
            window.location.reload();
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    return (
        <div>
            {product ? (
                <div>
                    <h1>{product.name}</h1>
                    <img src={product.picture} alt={product.name} />
                    <p><strong>Price:</strong> {product.price}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Average Rating:</strong> {product.averageRating}</p>
                    <p><strong>Quantity:</strong> {product.quantity}</p>
                    <p><strong>Sales:</strong> {product.sales}</p>
                    <p><strong>Archived:</strong> {product.isArchived ? 'Yes' : 'No'}</p>
                    <label>
                        Quantity to purchase:
                        <input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </label>
                    <button onClick={handlePurchase}>Purchase</button>
                </div>
            ) : (
                <div>Loading product...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path={homePath} text='Back' />{' '}
            <button onClick={copyToClipboard}>Copy Link</button>
        </div>
    );
};

export default GetProduct;