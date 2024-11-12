import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import { useNavigate } from 'react-router-dom';

const PurchasedProducts = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch purchased products if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchPurchasedProducts = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    const { purchasedProducts } = response.data.profile;

                    const products = await Promise.all(purchasedProducts.map(async (item) => {
                        const res = await axiosInstance.get(`/api/product/byId/${item.productId}`);
                        return { ...res.data, quantity: item.quantity };
                    }));

                    setProducts(products);
                } catch (err) {
                    setError(err.response.data.error || 'Failed to load purchased products.');
                }
            };

            fetchPurchasedProducts();
        }
    }, [auth]);

    const handleSubmitReview = async (e, productId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rating = formData.get('rating');
        const title = formData.get('title');
        const body = formData.get('body');

        try {
            await axiosInstance.post('/api/review', {
                rating,
                title,
                body,
                reviewedEntity: productId,
                reviewedEntityType: 'Product'
            });
            alert('Review submitted successfully');
            window.location.reload();
        } catch (err) {
            setError('Failed to submit review.');
        }
    };

    const renderReviewForm = (productId) => (
        <form onSubmit={(e) => handleSubmitReview(e, productId)}>
            <div>
                <label>Rating:</label>
                <input type="number" name="rating" min="0" max="5" required />
            </div>
            <div>
                <label>Title:</label>
                <input type="text" name="title" />
            </div>
            <div>
                <label>Body:</label>
                <textarea name="body"></textarea>
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );

    return (
        <div>
            <NavigateButton path={"/touristAccount"} text={"Back"} />
            <h2>Purchased Products</h2>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <div><strong>Name:</strong> {product.name}</div>
                        <div><strong>Price:</strong> {product.price}</div>
                        <div><strong>Description:</strong> {product.description}</div>
                        <div><strong>Quantity Purchased:</strong> {product.quantity}</div>
                        <div><strong>Average Rating:</strong> {product.averageRating}</div>
                        <div><strong>Sales:</strong> {product.sales}</div>
                        <div><strong>Archived:</strong> {product.isArchived ? 'Yes' : 'No'}</div>
                        {renderReviewForm(product._id)}
                    </div>
                ))
            ) : (
                <div>No purchased products.</div>
            )}
            {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
        </div>
    );
};

export default PurchasedProducts;