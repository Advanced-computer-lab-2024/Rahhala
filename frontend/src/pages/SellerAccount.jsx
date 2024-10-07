import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const SellerAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState(null); 
    const [error, setError] = useState(null); // State to handle errors
    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchSeller = async () => {
                try {
                    const response = await axiosInstance.get('/sellerAccount');
                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load Seller profile.');
                }
            };

            fetchSeller();
        }
        

    }, [auth]);
  return (
<div>
    {error && <p>{error}</p>}
    {profile ? (
        <div>
            {Object.entries(profile).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
        </div>
    ) : (
        <p>Loading profile...</p>
    )}
    <NavigateButton path={"/updateSellerAccount"} text={"Update Profile"}/>{'\u00A0'}
    <NavigateButton path={"/seller-dashboard"} text={"Home"}/>{'\u00A0'}
</div>  )
}

export default SellerAccount