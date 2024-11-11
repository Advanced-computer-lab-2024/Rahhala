import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';

const TouristDeleteAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [error, setError] = useState(null); // State to handle errors

    const handleDeleteRequest = async () => {
        try {
            const response = await axiosInstance.post('/api/accountDeletionRequest', {});
            if (response.status === 201) {
                navigate('/viewTouristAccount');
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('This Account already made an account deletion request.');
            } else {
                setError('Failed to request account deletion.');
            }
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
            <NavigateButton path={"/viewTouristAccount"} text={"Back"} />{'\u00A0'}

            <h2>Request Account Deletion</h2>
            {error && <div>{error}</div>}
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button onClick={handleDeleteRequest}>Request Account Deletion</button>
        </div>
    );
};

export default TouristDeleteAccount;