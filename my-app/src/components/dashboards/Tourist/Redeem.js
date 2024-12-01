import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Header from "../../Header.js";

function RedeemPage() {
    const { auth } = useContext(AuthContext);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0); 
    const [redeemedPoints, setRedeemedPoints] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [redeemMessage, setRedeemMessage] = useState(""); 
    const [messageType, setMessageType] = useState(""); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              const response = await axiosInstance.get('/api/tourist/');    
              setWalletBalance(response.data.profile.wallet);
              setLoyaltyPoints(response.data.profile.currentLoyaltyPoints);
    
            } catch (err) {
              setError('Failed to load tourist profile.');
            }
          };
          fetchProfile();
    
    }, [auth]);
    
    const handleRedeem = async (points) => {
        try {
            const response = await axiosInstance.post('/api/tourist/redeemLoyaltyPoints', { pointsToRedeem:points });
            setRedeemMessage(response.data.message);
            setMessageType("success");
            window.location.reload();

        } catch (err) {
            setRedeemMessage(err.response.data.error);
            setMessageType("error");
        }
        
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <Header />
        <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
        >
            ← Back
        </button>

    
        <div className="flex justify-center items-center mt-20">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6 text-center">Redeem Loyalty Points</h1>

            <div className="text-center mb-6">
                <p className="text-lg font-semibold">Current Loyalty Points: {loyaltyPoints}</p>
                <p className="text-sm text-gray-500">Your wallet balance: ${walletBalance}</p>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                onClick={() => handleRedeem(10000)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                Redeem 10,000 Points
                </button>
                <button
                onClick={() => handleRedeem(20000)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                Redeem 20,000 Points
                </button>
                <button
                onClick={() => handleRedeem(30000)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                Redeem 30,000 Points
                </button>
            </div>

            <p className="text-sm text-center text-gray-500 mt-4">
                Note: 10,000 points are equal to $100 in your wallet.
            </p>

            
            {redeemMessage && (
                <div
                className={`mt-4 text-center text-sm ${messageType === "success" ? "text-green-500" : "text-red-500"}`}
                >
                <p>{redeemMessage}</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}

export default RedeemPage;
