import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';

const Wallet = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [wallet, setWallet] = useState(0); // State to hold the wallet amount
    const [amount, setAmount] = useState(''); // State to hold the amount to add
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch wallet amount if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchWallet = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    setWallet(response.data.profile.wallet);
                } catch (err) {
                    setError('Failed to load wallet amount.');
                }
            };

            fetchWallet();
        }
    }, [auth]);

    const handleAddMoney = async () => {
        try {
            const response = await axiosInstance.put('/api/tourist/addMoneyToWallet', { amount: parseFloat(amount) });
            setWallet(response.data.wallet);
            setAmount('');
        } catch (err) {
            setError('Failed to add money to wallet.');
        }
    };

    // Loading state while fetching the user data
    if (auth.loading) {
        return <div>Loading user data...</div>;
    }

    // Check if the user is authenticated
    if (!auth.isAuthenticated) {
        return <div>You are not authenticated.</div>;
    }

    return (
        <div>
            <NavigateButton path={"/touristAccount"} text={"Back"}/>{'\u00A0'}

            <h2>My Wallet</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <strong>Current Wallet Amount:</strong> {wallet} EGP
            </div>
            <div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to add"
                />
                <button onClick={handleAddMoney}>Add Money</button>
            </div>
        </div>
    );
};

export default Wallet;