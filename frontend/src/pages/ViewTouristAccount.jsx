import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Auth/Logout';
import NavigateButton from '../components/UpdateProfileButton';

const ViewTouristAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState(null); // State to hold the tourist profile
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;

                    delete response.data.profile.bookedActivities;
                    delete response.data.profile.bookedItineraries;
                    delete response.data.profile.bookedMuseums;
                    delete response.data.profile.complaints;
                    delete response.data.profile.purchasedProducts;

                    const preferenceTagsResponse = await axiosInstance.get('/api/preferenceTag');
                    const preferenceTags = preferenceTagsResponse.data;
                    response.data.profile.preferences = response.data.profile.preferences.map((preferenceId) => {
                        const tag = preferenceTags.find((tag) => tag._id === preferenceId);
                        return tag ? tag.name : preferenceId;
                    }).join(', ');
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchTourist();
        }
    }, [auth]);

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

            <h2>Tourist Profile</h2>
            {profile ? (
                <div>
                    {Object.keys(profile).map((key) => (
                        <div key={key}>
                            <strong>{key}:</strong> {profile[key]}
                        </div>
                    ))}
                </div>
            ) : (
                <div>Loading profile...</div>
            )}
            <NavigateButton path={"/toursitUpdateAccount"} text={"Update Account"}/>{'\u00A0'}
            <NavigateButton path={"/touristDeleteAccount"} text={"Request Account Deletion"}/>{'\u00A0'}

        </div>
    );
};

export default ViewTouristAccount;