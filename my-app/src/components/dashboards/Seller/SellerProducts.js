import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import SellerHeader from './SellerHeader';
const SellerProducts = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [newProductModalOpen, setNewProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/api/product/myProducts');
                setProducts(response.data);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch products');
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get('/api/review');
                setReviews(response.data);
            } catch (err) {
                setError('Failed to load reviews.');
            }
        };

        const fetchSellers = async () => {
            try {
                const response = await axiosInstance.get('/api/seller/all');
                setSellers(response.data);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch sellers');
            }
        };

        fetchProducts();
        fetchReviews();
        fetchSellers();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleMoreInfo = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const renderReviews = (productId) => {
        const productReviews = reviews.filter(review => 
            review.reviewedEntity.toString() === productId && 
            review.reviewedEntityType === 'Product'
        );
        
        const averageRating = productReviews.length > 0
            ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
            : 0;
        const currProduct = products.find(product => product._id === productId);
        if(sellers.length === 0 || !currProduct) return null;
        const seller = sellers.find(seller => seller._id === currProduct.sellerId);
        
        return (
            <div>
                <h4 className="font-semibold mt-2">Reviews</h4>
                <div className="mb-3 p-2 bg-gray-50 rounded">
                    {seller?.username && <p className="text-lg font-semibold">{seller.username}</p>}

                    <p className="text-lg font-medium">
                        Average Rating: {averageRating}/5.0 ⭐
                    </p>
                    <p className="text-sm text-gray-600">
                        ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                    </p>
                </div>
                {modalOpen && selectedProduct && (
                <div>
                    {productReviews.length > 0 ? (
                    productReviews.map((review, idx) => (
                        <div key={idx} className="mt-2 border-b pb-2">
                        <p><strong>Rating:</strong> {review.rating}/5</p>
                        <p><strong>Title:</strong> {review.title}</p>
                        <p>{review.body}</p>
                        </div>
                    ))
                    ) : (
                    <p>No reviews available</p>
                    )}
                </div>
                )}            
                </div>
        );
    };

    const handleFileChange = (e) => {
        console.log(editProduct.picture)
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditProduct({ ...editProduct, picture: reader.result.split(',')[1] });
            console.log(reader.result.split(',')[1])

        };
        reader.readAsDataURL(file);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("edit prod id",editProduct._id);
        try{
            const response = await axiosInstance.put(`/api/product/edit/${editProduct._id}`, editProduct);
            alert('Product updated successfully');
            window.location.reload();
        } catch(err){
            console.log("Error is", err);
            alert(err.response?.data?.message || err.response?.data?.error || 'Error updating product.');
            setError('Failed to update product');
        }
        console.log(editProduct);
    }


    const renderEditModal = () => {
        return(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
                    <form onSubmit={handleSubmit} >
                        <label className="text-sm text-gray-600">Product Name</label>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Description</label>
                        <input
                            type="text"
                            placeholder="Product Description"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editProduct.description}
                            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Price</label>
                        <input
                            type="number"
                            placeholder="Product Price"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Image</label>
                        <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            onChange={(e) => handleFileChange(e)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded"
                        >
                            Save Changes
                        </button>
                        <button
                            className="w-full bg-red-600 text-white p-2 rounded mt-4"
                            onClick={() => {setEditModalOpen(false)
                                setEditProduct({})
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const handleArchive = async (productId, isArchived) => {
        if(isArchived){
            try {
                const response = await axiosInstance.put(`/api/product/unarchive/${productId}`);
                alert('Product unarchived successfully');
                window.location.reload();
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                alert(err.response?.data?.message || err.response?.data?.error || 'Error updating product.');
            }
        } else {
                try {
                    const response = await axiosInstance.put(`/api/product/archive/${productId}`);
                    alert('Product archived successfully');
                    window.location.reload();
                } catch (err) {
                    console.log("Error is", err); // Log error if fetching fails
                    alert(err.response?.data?.message || err.response?.data?.error || 'Error updating product.');
                }
            }

    }

    const handleNewFileChange = (e) => {
        console.log(auth)
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct({ ...newProduct, picture: reader.result.split(',')[1] });
        };
        reader.readAsDataURL(file);
    };

    const handleNewProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/product/create', newProduct);
            alert('Product added successfully');
            window.location.reload();
        } catch (err) {
            console.log("Error is", err); // Log error if fetching fails
            alert(err.response?.data?.message || err.response?.data?.error || 'Error adding product.');
            setError('Failed to add product');
        }
    };

    const renderNewProductModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
                    <form onSubmit={handleNewProductSubmit}>
                        <label className="text-sm text-gray-600">Product Name</label>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Description</label>
                        <input
                            type="text"
                            placeholder="Product Description"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <label className="text-sm text-gray-600">Product Price</label>
                        <input
                            type="number"
                            placeholder="Product Price"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Quantity</label>
                        <input
                            type="number"
                            placeholder="Product Quantity"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Image</label>
                        <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            onChange={(e) => handleNewFileChange(e)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded"
                        >
                            Add Product
                        </button>
                        <button
                            className="w-full bg-red-600 text-white p-2 rounded mt-4"
                            onClick={() => {
                                setNewProductModalOpen(false);
                                setNewProduct({});
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SellerHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-4xl font-bold mb-4 text-center">Products</h2>
                        <button
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() => setNewProductModalOpen(true)}
                        >
                            Add New Product
                        </button>
                        {newProductModalOpen && renderNewProductModal()}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {editModalOpen && renderEditModal()}
                        {products.map((product) => (
                            <div key={product._id} className="bg-white shadow-md rounded-lg p-4 text-center w-full lg:w-72 flex flex-col justify-between">
                                <div>
                                    <img
                                        src={product.picture ? `data:image/jpeg;base64,${product.picture}` : '/path/to/default/image.jpg'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-lg font-semibold text-blue-500">${product.price}</p>
                                    
                                    {/* Add average rating display */}
                                    {renderReviews(product._id)}
                                </div>
                                <div className="flex justify-center mt-4 space-x-4">
                                    <button
                                        onClick={() => handleMoreInfo(product)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        More Info
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        onClick={() => {
                                            setEditProduct(product);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    {product.isArchived ? (
                                        <button
                                            onClick={() => handleArchive(product._id, product.isArchived)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Unarchive
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleArchive(product._id, product.isArchived)}
                                            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                                        >
                                            Archive
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <div className="space-y-4">
                            <p className="text-gray-700"><strong>Description:</strong> {selectedProduct.description}</p>
                            <p className="text-gray-700"><strong>Price:</strong> ${selectedProduct.price}</p>
                            
                            {/* Add reviews section in modal */}
                            {renderReviews(selectedProduct._id)}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;