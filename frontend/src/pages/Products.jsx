import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const Products = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const { auth } = useContext(AuthContext); // Get auth context
    
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/toursitAccount';
    }
    else if(auth.user && auth.user.type === 'seller'){
        homePath = '/seller-dashboard';
    }
    else if(auth.user && auth.user.type === 'admin'){
        homePath = '/AdminDashboard';
    }
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/api/product');
                console.log(response.data);
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    const filterProducts = () => {
        return products.filter(product => {
            return (
                (price ? product.price.toString().startsWith(price) : true) &&
                (rating ? product.averageRating >= rating : true) &&
                (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            );
        });
    };

    const sortProducts = (products) => {
        return products.sort((a, b) => {
            return sortOrder === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
        });
    };

    const filteredProducts = products ? filterProducts() : [];
    const sortedProducts = sortProducts(filteredProducts);

    return (
        <div>
            <div>
                <label>
                    Price:
                    <input min="0" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label>
                    Rating:
                    <input type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)} 
                        min="0"
                        max="5"/>
                </label>
                <label>
                    Sort by rating:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>
            {products ? (
                <table>
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Description</th>
                            <th>Seller</th>
                            <th>Rating</th>
                            <th>ID</th>

                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map(product => (
                            <tr key={product._id}>
                                <td><img src={product.picture} alt={product.name} width="50" /></td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.description}</td>
                                <td>{product.sellerName}</td>
                                <td>{product.averageRating}</td>
                                <td>{product._id}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading products...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path={homePath} text='Back'/>{'\u00A0'}
        </div>
    );
};

export default Products;