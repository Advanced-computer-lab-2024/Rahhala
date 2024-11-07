// ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  const toggleArchiveStatus = async (productId, currentStatus) => {
    try {
      const response = await axios.put(`/api/products/${productId}/archive`, {
        isArchived: !currentStatus,
      });
      // Update the local state to reflect the new archive status
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, isArchived: !currentStatus } : product
        )
      );
    } catch (err) {
      setError("Failed to update product archive status.");
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Available Quantity</th>
            <th>Sales</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.sales}</td>
              <td>{product.isArchived ? "Archived" : "Active"}</td>
              <td>
                <button
                  onClick={() => toggleArchiveStatus(product.id, product.isArchived)}
                >
                  {product.isArchived ? "Unarchive" : "Archive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
