import React, { useState } from "react";
import Header from "../../Header.js";


const products = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    description: "A great product for your needs.",
    seller: "Seller 1",
    rating: 4.5,
    image: "https://via.placeholder.com/150",
    salesQuantity: 120,
    archived: false,
  },
  {
    id: 2,
    name: "Product 2",
    price: 49.99,
    description: "Another great product for your needs.",
    seller: "Seller 2",
    rating: 4.2,
    image: "https://via.placeholder.com/150",
    salesQuantity: 200,
    archived: false,
  },
  {
    id: 3,
    name: "Product 3",
    price: 19.99,
    description: "Affordable and effective.",
    seller: "Seller 3",
    rating: 4.8,
    image: "https://via.placeholder.com/150",
    salesQuantity: 300,
    archived: false,
  },
  {
    id: 4,
    name: "Product 4",
    price: 39.99,
    description: "Durable and reliable.",
    seller: "Seller 4",
    rating: 4.0,
    image: "https://via.placeholder.com/150",
    salesQuantity: 50,
    archived: false,
  },
  {
    id: 5,
    name: "Product 5",
    price: 59.99,
    description: "Premium quality product.",
    seller: "Seller 5",
    rating: 4.7,
    image: "https://via.placeholder.com/150",
    salesQuantity: 400,
    archived: false,
  },
  {
    id: 6,
    name: "Product 6",
    price: 99.99,
    description: "Top-of-the-line product.",
    seller: "Seller 6",
    rating: 4.9,
    image: "https://via.placeholder.com/150",
    salesQuantity: 600,
    archived: false,
  },
];

function ProductsPage() {
  const [view, setView] = useState("all");
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [review, setReview] = useState({ title: "", body: "", rating: 1 });

  const filterProducts = () => {
    if (view === "purchased") {
      return purchasedProducts;
    }
    return products;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleBuy = (product) => {
    const qty = quantity[product.id] || 1;
    alert(`Purchased ${qty} of ${product.name}`);
    setPurchasedProducts((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
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
                <p className="text-sm text-gray-500">Seller: {product.seller}</p>
                <p className="text-sm text-yellow-500">Rating: {product.rating} ⭐</p>

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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
  <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>
  <img
    src={selectedProduct.image}
    alt={selectedProduct.name}
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
  <p className="text-gray-700 mb-2">
    <strong>Description:</strong> {selectedProduct.description}
  </p>
  <p className="text-gray-700 mb-2">
    <strong>Price:</strong> ${selectedProduct.price}
  </p>
  <p className="text-gray-700 mb-2">
    <strong>Seller:</strong> {selectedProduct.seller}
  </p>
  <p className="text-gray-700 mb-2">
    <strong>Rating:</strong> {selectedProduct.rating} ⭐
  </p>
  <p className="text-gray-700 mb-2">
    <strong>Sales Quantity:</strong> {selectedProduct.salesQuantity}
  </p>
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
