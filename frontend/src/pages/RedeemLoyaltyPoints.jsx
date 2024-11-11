import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';

const RedeemLoyaltyPoints = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState(null); // State to hold the tourist profile
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to hold success message

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchTourist();
        }
    }, [auth]);

    const handleRedeemPoints = async (pointsToRedeem) => {
        try {
            const response = await axiosInstance.post('/api/tourist/redeemLoyaltyPoints', { pointsToRedeem });
            setMessage(response.data.message);
            setProfile((prevProfile) => ({
                ...prevProfile,
                currentLoyaltyPoints: prevProfile.currentLoyaltyPoints - pointsToRedeem,
            }));
        } catch (err) {
            setError(err.response.data.error);
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
            <NavigateButton path={"/touristAccount"} text={"Back"} />{'\u00A0'}

            <h2>Redeem Loyalty Points</h2>
            {profile ? (
                <div>
                    <div>
                        <strong>Current Loyalty Points:</strong> {profile.currentLoyaltyPoints}
                    </div>
                    <div>
                        <button onClick={() => handleRedeemPoints(10000)}>Redeem 10,000 Points</button>
                        <button onClick={() => handleRedeemPoints(20000)}>Redeem 20,000 Points</button>
                        <button onClick={() => handleRedeemPoints(30000)}>Redeem 30,000 Points</button>
                    </div>
                    {message && <div>{message}</div>}
                    <div>Note: 10,000 points are equal to 100 in the wallet.</div>
                </div>
            ) : (
                <div>Loading profile...</div>
            )}
            {error && <div>{error}</div>}
        </div>
    );
};

export default RedeemLoyaltyPoints;
