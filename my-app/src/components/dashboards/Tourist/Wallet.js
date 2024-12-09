import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const PaymentForm = ({ amount, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            onError(error.message);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/tourist/createPaymentIntent', {
                amount: amount,
                payment_method: paymentMethod.id,
            });

            const { client_secret } = response.data;

            const { error: confirmError } = await stripe.confirmCardPayment(client_secret);

            if (confirmError) {
                onError(confirmError.message);
            } else {
                onSuccess();
            }
        } catch (err) {
            onError(err.response?.data?.message || 'Payment failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
};

const Wallet = () => {
    const { auth } = useContext(AuthContext);
    const [walletBalance, setWalletBalance] = useState(0);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const navigate = useNavigate();

    const fetchWalletData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/tourist/');
            setWalletBalance(response.data.profile.wallet);
            setTransactions(response.data.profile.transactions || []);
        } catch (err) {
            setError('Failed to load wallet information');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            fetchWalletData();
        }
    }, [auth]);

    const handleAddMoney = async () => {
        const amount = parseFloat(amountToAdd);
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Show payment form
        setShowPaymentForm(true);
    };

    const handlePaymentSuccess = () => {
        setSuccess('Money added successfully!');
        setAmountToAdd('');
        fetchWalletData(); // Refresh transactions
        setIsLoading(false);
        setShowPaymentForm(false);
    };

    const handlePaymentError = (message) => {
        setError(message);
        setIsLoading(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center hover:text-blue-700"
            >
                <span className="mr-2">←</span> Back
            </button>
            
            <div className="max-w-2xl mx-auto p-4">
                {/* Wallet Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
                        Wallet Balance
                    </h1>
                    <p className="text-4xl font-bold text-center text-green-600 mb-6">
                        ${walletBalance.toFixed(2)}
                    </p>

                    {/* Add Money Section */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={amountToAdd}
                                onChange={(e) => setAmountToAdd(e.target.value)}
                                placeholder="Enter amount"
                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                            <button
                                onClick={handleAddMoney}
                                disabled={isLoading}
                                className={`px-6 py-3 rounded-lg text-white font-semibold
                                    ${isLoading 
                                        ? 'bg-gray-400' 
                                        : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {isLoading ? 'Processing...' : 'Add Money'}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                                {success}
                            </div>
                        )}
                    </div>
                </div>

                {/* Transactions History */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No transactions yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div 
                                    key={transaction.id}
                                    className="flex justify-between items-center p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{transaction.type}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`font-bold ${
                                        transaction.type === 'CREDIT' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'CREDIT' ? '+' : '-'}
                                        ${transaction.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showPaymentForm && (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            amount={amountToAdd}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default Wallet;
