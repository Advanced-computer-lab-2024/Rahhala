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
        homePath = '/touristAccount';
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
                let response;
                if(userType === "seller"){
                    response = await axiosInstance.get('/api/product/myProducts');
                }
                else{
                    response = await axiosInstance.get('/api/product');
                }
                setProducts(response.data);
                setError(null);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
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
                (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
                (auth.user.type !== 'tourist' || !product.isArchived) // Exclude archived products for tourists
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

    const handleUploadPicture = async (productId, base64String) => {
        try {
            console.log("Uploading picture for productId:", productId); // Log productId before uploading picture
            await axiosInstance.post(`/api/product/uploadPicture/${productId}`, { picture: base64String });
            // Optionally, update the product's picture in the state
            setProducts(products.map(product => 
                product._id === productId ? { ...product, picture: base64String } : product
            ));
            setError('Picture uploaded successfully.');
        } catch (err) {
            setError('Failed to upload picture');
        }
    };

    const handleFileChange = (productId, event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            handleUploadPicture(productId, base64String);
        };
        reader.readAsDataURL(file);
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
                            {auth.user.type !== 'tourist' && <th>Archived</th>} {/* Conditionally display archived column */}
                            {auth.user.type !== 'tourist' && <th>Actions</th>} {/* New column for actions */}
                            {auth.user.type !== 'tourist' && <th>Upload Picture</th>} {/* New column for upload picture */}
                            <th>More Info</th> {/* New column for more info button */}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map(product => (
                            <tr key={product._id}>
                                <td><img src={`data:image/jpeg;base64,${product.picture}`} alt={product.name} width="50" /></td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.description}</td>
                                <td>{product.sellerId}</td>
                                <td>{product.averageRating}</td>
                                <td>{product._id}</td>
                                {auth.user.type !== 'tourist' && <td>{product.isArchived ? 'Yes' : 'No'}</td>} {/* Conditionally display isArchived */}
                                {auth.user.type !== 'tourist' && (
                                    <td>
                                        {!product.isArchived ? (
                                            <button onClick={() => handleArchive(product._id)}>Archive</button>
                                        ) : (
                                            <button onClick={() => handleUnarchive(product._id)}>Unarchive</button>
                                        )}
                                    </td>
                                )}
                                {auth.user.type !== 'tourist' && (
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter image URL"
                                            onBlur={(e) => handleUrlChange(product._id, e)}
                                        />
                                    </td>
                                )}
                                <td>
                                    <NavigateButton path={`/getProduct/${product._id}`} text='More Info'/>{'\u00A0'}
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