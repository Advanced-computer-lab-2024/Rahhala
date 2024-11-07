// ProductOverview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductOverview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product data");
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  if (loading) return <div>Loading product data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Product Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Available Quantity</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductOverview;
