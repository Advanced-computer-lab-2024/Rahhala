import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from "../../Header.js";

function TouristOrders() {
    const { auth } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/api/tourist');
                setOrders(response.data.profile.orders);
            } catch (err) {
                console.log("Error is", err);
                setError('Failed to fetch orders');
            }
        };

        fetchOrders();
    }, [auth]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex justify-center items-center mt-20">
                <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-6">My Orders</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    {orders.length > 0 ? (
                        orders.map((order, idx) => (
                            <div key={idx} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-2">Order #{idx + 1}</h2>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                                <h3 className="text-lg font-semibold mt-4">Items:</h3>
                                <div className="ml-6">
                                    {order.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="mb-4">
                                            <p><strong>Product ID:</strong> {item.productId}</p>
                                            <p><strong>Quantity:</strong> {item.quantity}</p>
                                            <p><strong>Price:</strong> ${item.price}</p>
                                            {itemIdx < order.items.length - 1 && <hr className="my-2 border-gray-300" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TouristOrders;
