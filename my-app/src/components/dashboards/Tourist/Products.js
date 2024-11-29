import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from "../../Header.js";

function ProductsPage() {
    const { auth } = useContext(AuthContext);
    const [view, setView] = useState("all");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [review, setReview] = useState({ title: "", body: "", rating: 1 });
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axiosInstance.get('/api/seller/all');
                setSellers(response.data);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch sellers');
            }
        }

        fetchSellers();

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
                if (response.data.length === 0) {
                    setError('No products found');
                }
                else {
                    setProducts(response.data);
                    setError(null);
                }
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch products');
            }
        };
        fetchProducts();

        const fetchReviews = async () => {
            try {
              const response = await axiosInstance.get('/api/review');
              setReviews(response.data);
            } catch (err) {
              setError('Failed to load reviews.');
            }
          };
      
        fetchReviews();

      
    }, [auth]);

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
                    <p className="text-sm text-gray-500">Seller: {seller.username}</p>

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

    const filterProducts = () => {
        if (view === "purchased") {
            const purchasedProductIds = auth.user.purchasedProducts;
            const purchasedProducts = products.filter(product => purchasedProductIds.includes(product._id));
            return purchasedProducts;
        }
        return products;
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleBuy = async (product) => {
        try {
            console.log("quantity is", quantity);
            await axiosInstance.post('/api/tourist/purchaseProduct', {
                productId: product._id,
                quantity: quantity
            });
            alert('Purchase successful!');
            window.location.reload();
        } catch (err) {
            console.log("Error is", err); // Log error if purchase fails
            setError(err.response.data.error);
        }
    };

    const handleIncrease = (product) => {
        setQuantity((prev) => ({
            ...prev,
            [product.id]: (prev[product.id] || 1) + 1,
        }));
    };

    const handleDecrease = (product) => {
        if ((quantity[product.id] || 1) > 1) {
            setQuantity((prev) => ({
                ...prev,
                [product.id]: (prev[product.id] || 1) - 1,
            }));
        }
    };

    const handleMoreInfo = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleReview = (product) => {
        setSelectedProduct(product);
        setReviewModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setReview({ title: "", body: "", rating: 1 });
    };

    const handleSubmitReview = () => {
        alert(`Review submitted for ${selectedProduct.name}:\nTitle: ${review.title}\nBody: ${review.body}\nRating: ${review.rating}`);
        closeReviewModal();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

            <div className="flex justify-center items-center mt-20">
                <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Products</h1>

                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setView("all")}
                            className={`px-6 py-3 rounded-lg ${
                                view === "all"
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                            View All
                        </button>
                        <button
                            onClick={() => setView("purchased")}
                            className={`px-6 py-3 rounded-lg ${
                                view === "purchased"
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                            Purchased Products
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterProducts().map((product) => (
                            <div key={product.id} className="bg-white shadow-md rounded-lg p-4 text-center w-full lg:w-72">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                <p className="text-gray-600">{product.description}</p>
                                <p className="text-lg font-semibold text-blue-500">${product.price}</p>
                                
                                {/* Add average rating display */}
                                {renderReviews(product._id)}

                                {view === "all" && (
                                    <div className="mt-4 flex justify-center items-center space-x-2">
                                        <button
                                            onClick={() => handleDecrease(product)}
                                            className="px-4 py-2 bg-white text-blue-500 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity[product.id] || 1}
                                            onChange={(e) =>
                                                setQuantity((prev) => ({
                                                    ...prev,
                                                    [product.id]: Number(e.target.value),
                                                }))
                                            }
                                            min="1"
                                            className="w-16 px-4 py-2 border rounded-lg text-center"
                                        />
                                        <button
                                            onClick={() => handleIncrease(product)}
                                            className="px-4 py-2 bg-white text-blue-500 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-center mt-4 space-x-4">
                                    {view === "purchased" ? (
                                        <button
                                            onClick={() => handleReview(product)}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Review
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleBuy(product)}
                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Buy
                                            </button>
                                            <button
                                                onClick={() => handleMoreInfo(product)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                More Info
                                            </button>
                                        </>
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

            {reviewModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">Review {selectedProduct.name}</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={review.title}
                                    onChange={(e) =>
                                        setReview((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="body" className="block text-gray-700 font-medium mb-2">
                                    Review
                                </label>
                                <textarea
                                    id="body"
                                    value={review.body}
                                    onChange={(e) =>
                                        setReview((prev) => ({ ...prev, body: e.target.value }))
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    rows="4"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">
                                    Rating
                                </label>
                                <input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={review.rating}
                                    onChange={(e) =>
                                        setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
                                    }
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeReviewModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitReview}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsPage;