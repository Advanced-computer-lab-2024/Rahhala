import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';

const Wallet = () => {
    const { auth } = useContext(AuthContext); // Get auth context
    const [walletBalance, setWalletBalance] = useState(250.0); 
    const [amountToAdd, setAmountToAdd] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState(null); // State to handle errors

    const navigate = useNavigate();
    useEffect(() => {
        // Only fetch wallet amount if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchWallet = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    setWalletBalance(response.data.profile.wallet);
                } catch (err) {
                    setError('Failed to load wallet amount.');
                }
            };

            fetchWallet();
        }
    }, [auth]);

    const handleAddMoney = async () => {
        try {
            const response = await axiosInstance.put('/api/tourist/addMoneyToWallet', { amount: parseFloat(amountToAdd) });
            setWalletBalance(response.data.wallet);
            setAmountToAdd('');
        } catch (err) {
            setError('Failed to add money to wallet.');
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
        <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
        >
            ← Back
        </button>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h1 className="text-2xl font-semibold mb-6 text-center">Wallet Balance</h1>
            <p className="text-xl text-center mb-4">${walletBalance.toFixed(2)}</p>
            <div className="space-y-4">
            <input
                type="number"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button
                onClick={handleAddMoney}
                className="w-full py-2 bg-green-500 text-white rounded-md"
            >
                Add Money
            </button>
            </div>
        </div>
        </div>
    );
};

export default Wallet;
