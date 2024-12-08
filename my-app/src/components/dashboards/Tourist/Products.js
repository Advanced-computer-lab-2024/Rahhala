import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from "../../Header.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function ProductsPage() {
    const { auth } = useContext(AuthContext);
    const [view, setView] = useState("all");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [review, setReview] = useState({ title: "", body: "", rating: 1 });
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [tourist, setTourist] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [deliveryAddresses, setDeliveryAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
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
                    response.data = response.data.filter(product => !product.isArchived);
                }
                if (response.data.length === 0) {
                    setError('No products found');
                }
                else {
                    setProducts(response.data);
                    const initialQuantities = response.data.reduce((acc, product) => {
                        acc[product._id] = 1;
                        return acc;
                    }, {});
                    setQuantity(initialQuantities);
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

        const fetchTourist = async () => {
            try {
                const response = await axiosInstance.get('/api/tourist');
                setTourist(response.data);
                setDeliveryAddresses(response.data.profile.deliveryAddresses);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch tourist');
            }
        }
        fetchTourist();

      
    }, [auth]);

    const renderReviews = (productId) => {
        const productReviews = reviews.filter(review => 
            review.reviewedEntity.toString() === productId && 
            review.reviewedEntityType === 'Product'
        );

        if (productReviews.length === 0) return null;
        
        
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
                    {seller ? <p className="text-sm text-gray-500">Seller: {seller.username}</p> : 
                    <p className="text-sm text-gray-500">Admin</p>}

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
            if (!tourist) return [];
            const purchasedProductIds = tourist.profile.purchasedProducts.map(purchase => purchase.productId);
            console.log("Purchased product ids are", purchasedProductIds);
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
                quantity: quantity[product._id]
            });
            alert('Purchase successful!');
            window.location.reload();
        } catch (err) {
            alert(err.response.data.error)
            console.log("Error is", err); // Log error if purchase fails
            setError(err.response.data.error);
        }
    };

    const handleIncrease = (product) => {
        setQuantity((prev) => ({
            ...prev,
            [product._id]: (prev[product._id] || 1) + 1,
        }));
    };

    const handleDecrease = (product) => {
        if ((quantity[product._id] || 1) > 1) {
            setQuantity((prev) => ({
                ...prev,
                [product._id]: (prev[product._id] || 1) - 1,
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

    const handleSubmitReview = async () => {
        try {
            await axiosInstance.post('/api/review', {
                rating: review.rating,
                title: review.title,
                body: review.body,
                reviewedEntity: selectedProduct._id,
                reviewedEntityType: "Product"
            });
            alert('Review submitted successfully');
            window.location.reload();
        } catch (err) {
            setError('Failed to submit review.');
        }
        closeReviewModal();
    };

    const handleAddToCart = async (product) => {
        try {
            await axiosInstance.post(`/api/tourist/cart/${product._id}/${quantity[product._id] || 1}`);
            alert('Product added to cart!');
        } catch (err) {
            alert(err.response.data.error);
            console.log("Error is", err); // Log error if adding to cart fails
            setError(err.response.data.error);
        }
    };

    const handleCartClick = async () => {
        try {
            const response = await axiosInstance.get('/api/tourist');
            const touristData = response.data;
            const cartItems = touristData.profile.cart.map(cartItem => {
                const product = products.find(p => p._id === cartItem.product);
                return { ...product, quantity: cartItem.quantity };
            });
            setCart(cartItems);
            setCartModalOpen(true);
        } catch (err) {
            console.log("Error is", err); // Log error if fetching cart fails
            setError('Failed to fetch cart');
        }
    };

    const closeCartModal = () => {
        setCartModalOpen(false);
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await axiosInstance.delete(`/api/tourist/cart/${productId}`);
            alert('Product removed from cart!');
            window.location.reload();
        } catch (err) {
            alert(err.response.data.error);
            console.log("Error is", err); // Log error if removing from cart fails
            setError(err.response.data.error);
        }
    };

    const handleCheckoutClick = async () => {
        try {
            const response = await axiosInstance.get('/api/tourist');
            const touristData = response.data;
            if (touristData.profile.deliveryAddresses.length === 0) {
                alert('You need to add a delivery address in your profile page.');
            } else {
                setDeliveryAddresses(touristData.profile.deliveryAddresses);
                setCheckoutModalOpen(true);
            }
        } catch (err) {
            console.log("Error is", err); // Log error if fetching delivery addresses fails
            setError('Failed to fetch delivery addresses');
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address.');
            return;
        }
        try {
            await axiosInstance.post('/api/tourist/checkout', {
                deliveryAddress: selectedAddress
            });
            alert('Checkout successful!');
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || 'Failed to checkout');
            console.log("Error is", err); // Log error if checkout fails
            setError(err.response.data.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <div className="flex justify-center items-center mt-20">
                <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-center flex-grow">Products</h1>
                        <FontAwesomeIcon 
                            icon={faShoppingCart} 
                            className="text-gray-600 cursor-pointer" 
                            size="2x"
                            onClick={handleCartClick}
                        />
                    </div>
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
                            <div key={product._id} className="bg-white shadow-md rounded-lg p-4 text-center w-full lg:w-72">
                                <img

                                    src={product.picture? `data:image/jpeg;base64,${product.picture}` : '/path/to/default/image.jpg'}
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
                                            value={quantity[product._id] || 1}
                                            onChange={(e) =>
                                                setQuantity((prev) => ({
                                                    ...prev,
                                                    [product._id]: Number(e.target.value),
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
                                {view !== "purchased" && (
                                    <div className="flex w-full justify-center mt-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                )}
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

            {cartModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                        {cart.length > 0 ? (
                            cart.map((item, idx) => (
                                <div key={idx} className="mb-4">
                                    <img
                                        src={item.picture ? `data:image/jpeg;base64,${item.picture}` : '/path/to/default/image.jpg'}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg mb-4" // Changed size to w-24 h-24
                                    />
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-lg font-semibold text-blue-500">${item.price}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <button
                                        onClick={() => handleRemoveFromCart(item._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-2"
                                    >
                                        Remove from Cart
                                    </button>
                                    {idx < cart.length - 1 && <hr className="my-4 border-1 border-gray-700" />} {/* Darker and thicker separator */}
                                </div>
                            ))
                        ) : (
                            <p>Your cart is empty</p>
                        )}
                        <div className="flex justify-end mt-4 space-x-4">
                            <button
                                onClick={closeCartModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                            {cart.length > 0 && (
                                <button
                                    onClick={handleCheckoutClick}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Checkout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {checkoutModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
                        <div className="mb-4">
                            {deliveryAddresses.map((address, idx) => (
                                <div key={idx} className="mb-2">
                                    <input
                                        type="radio"
                                        id={`address-${address}`}
                                        name="deliveryAddress"
                                        value={JSON.stringify(address)} // Convert address object to string
                                        onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))} // Parse string back to object
                                        className="mr-2"
                                    />
                                    <label htmlFor={`address-${idx}`} className="text-gray-700">{address}</label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button
                                onClick={() => setCheckoutModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsPage;