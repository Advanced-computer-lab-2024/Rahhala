import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import SellerHeader from './SellerHeader';
import { SpinnerCircular } from 'spinners-react';

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
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);
    const [productToArchive, setProductToArchive] = useState(null);

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
        setLoading(true);
        console.log("edit prod id",editProduct._id);
        try{
            const response = await axiosInstance.put(`/api/product/edit/${editProduct._id}`, editProduct);
            showToast('Product updated successfully', 'success');
            setEditModalOpen(false);
            window.location.reload();
        } catch(err){
            console.log("Error is", err);
            showToast(err.response?.data?.message || 'Error updating product', 'error');
            setError('Failed to update product');
        } finally {
            setLoading(false);
        }
        console.log(editProduct);
    }

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

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
                            min="0"
                            placeholder="Product Price"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editProduct.price}
                            onChange={(e) => handlePriceChange(e, setEditProduct)}
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
                showToast('Product unarchived successfully', 'success');
                window.location.reload();
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                showToast(err.response?.data?.message || 'Error updating product', 'error');
            }
        } else {
                try {
                    const response = await axiosInstance.put(`/api/product/archive/${productId}`);
                    showToast('Product archived successfully', 'success');
                    window.location.reload();
                } catch (err) {
                    console.log("Error is", err); // Log error if fetching fails
                    showToast(err.response?.data?.message || 'Error updating product', 'error');
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
            showToast('Product added successfully', 'success');
            window.location.reload();
        } catch (err) {
            console.log("Error is", err); // Log error if fetching fails
            showToast(err.response?.data?.message || 'Error adding product', 'error');
            setError('Failed to add product');
        }
    };

    const handlePriceChange = (e, setter) => {
        const value = Math.max(0, Number(e.target.value));
        setter(prev => ({ ...prev, price: value }));
    };

    const handleQuantityChange = (e, setter) => {
        const value = Math.max(0, Number(e.target.value));
        setter(prev => ({ ...prev, quantity: value }));
    };

    const confirmArchive = (product) => {
        setProductToArchive(product);
        setArchiveModalOpen(true);
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
                            min="0"
                            placeholder="Product Price"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.price}
                            onChange={(e) => handlePriceChange(e, setNewProduct)}
                            required
                        />
                        <label className="text-sm text-gray-600">Product Quantity</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Product Quantity"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newProduct.quantity}
                            onChange={(e) => handleQuantityChange(e, setNewProduct)}
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

    const Toast = ({ message, type }) => (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className={`rounded-lg px-4 py-3 shadow-lg ${
                type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
                <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">{message}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <SellerHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-500 flex items-center hover:text-blue-600"
                    >
                        <span className="mr-2">←</span> Back
                    </button>
                    <h2 className="text-3xl font-bold text-center text-gray-800">My Products</h2>
                    <div className="w-[72px]"></div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <button
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                        onClick={() => setNewProductModalOpen(true)}
                    >
                        Add New Product
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative">
                                <img
                                    src={product.picture ? `data:image/jpeg;base64,${product.picture}` : '/path/to/default/image.jpg'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/path/to/default/image.jpg';
                                    }}
                                />
                                {product.isArchived && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                        Archived
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold truncate">{product.name}</h3>
                                <p className="text-gray-600 h-12 overflow-hidden">{product.description}</p>
                                <p className="text-lg font-semibold text-blue-500 mt-2">${product.price.toFixed(2)}</p>
                                <div className="mt-2">
                                    {renderReviews(product._id)}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t">
                                <div className="flex justify-between space-x-2">
                                    <button
                                        onClick={() => handleMoreInfo(product)}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        More Info
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        onClick={() => {
                                            setEditProduct(product);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmArchive(product)}
                                        className={`flex-1 px-4 py-2 ${
                                            product.isArchived 
                                            ? 'bg-green-500 hover:bg-green-600' 
                                            : 'bg-red-700 hover:bg-red-800'
                                        } text-white rounded-lg transition-colors`}
                                    >
                                        {product.isArchived ? 'Unarchive' : 'Archive'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modals remain unchanged */}
            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>
                        <img
                            src={selectedProduct.picture ? `data:image/jpeg;base64,${selectedProduct.picture}` : '/path/to/default/image.jpg'}
                            alt={selectedProduct.name}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/path/to/default/image.jpg';
                            }}
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

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <SpinnerCircular />
                </div>
            )}

            {archiveModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm {productToArchive?.isArchived ? 'Unarchive' : 'Archive'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to {productToArchive?.isArchived ? 'unarchive' : 'archive'} this product?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setArchiveModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleArchive(productToArchive._id, productToArchive.isArchived);
                                    setArchiveModalOpen(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
};

export default SellerProducts;