import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const Products = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [products, setProducts] = useState([]); // State to hold products
    const [error, setError] = useState(null);
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
                let userType = auth.user.type;
                console.log("usertype is ",userType) // Log userType before fetching    
                let response;
                if(userType === "seller"){
                    response = await axiosInstance.get('/api/product/myProducts');
                }
                else{
                    response = await axiosInstance.get('/api/product');
                }
                console.log("response is ",response.data) 
                setProducts(response.data);
                console.log("Products are", response.data);
                console.log("usertype is ",userType) // Log products after fetching
            } catch (err) {
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, [auth]);

    const filterProducts = () => {
        return products.filter(product => {
            return (
                (price ? product.price.toString().startsWith(price) : true) &&
                (rating ? product.averageRating >= rating : true) &&
                (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            );
        });
    };

    const sortedProducts = filterProducts().sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.rating - b.rating;
        } else {
            return b.rating - a.rating;
        }
    });

    const handleArchive = async (productId) => {
        try {
            console.log("productId is", productId); // Log productId before archiving
            await axiosInstance.put(`/api/product/archive/${productId}`);
            setProducts(products.map(product => 
                product._id === productId ? { ...product, isArchived: true } : product
            ));
        } catch (err) {
            setError('Failed to archive product');
        }
    };

    const handleUnarchive = async (productId) => {
        try {
            console.log("productId is", productId); // Log productId before unarchiving
            await axiosInstance.put(`/api/product/unarchive/${productId}`);
            setProducts(products.map(product => 
                product._id === productId ? { ...product, isArchived: false } : product
            ));
        } catch (err) {
            setError('Failed to unarchive product');
        }
    };

    const handleUploadPicture = async (productId, url) => {
        try {
            console.log("Uploading picture for productId:", productId); // Log productId before uploading picture
            await axiosInstance.post(`/api/product/uploadPicture/${productId}`, { picture: url });
            // Optionally, update the product's picture in the state
            setProducts(products.map(product => 
                product._id === productId ? { ...product, picture: url } : product
            ));
        } catch (err) {
            setError('Failed to upload picture');
        }
    };

    const handleUrlChange = (productId, event) => {
        const url = event.target.value;
        handleUploadPicture(productId, url);
    };

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
            {products.length > 0 ? (
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
                            <th>Archived</th>
                            <th>Actions</th> {/* New column for actions */}
                            <th>Upload Picture</th> {/* New column for upload picture */}
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
                                <td>{product.sellerId}</td>
                                <td>{product.averageRating}</td>
                                <td>{product._id}</td>
                                <td>{product.isArchived ? 'Yes' : 'No'}</td> {/* Display isArchived */}
                                <td>
                                    {!product.isArchived ? (
                                        <button onClick={() => handleArchive(product._id)}>Archive</button>
                                    ) : (
                                        <button onClick={() => handleUnarchive(product._id)}>Unarchive</button>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        onBlur={(e) => handleUrlChange(product._id, e)}
                                    />
                                </td>
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