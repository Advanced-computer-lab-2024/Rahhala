import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Auth/Logout';
const TouristAccount = () => {
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
                    setProfile(response.data.profile);
                    console.log(response.data.profile);
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
            <NavigateButton path={"/viewAll"} text={"View All"}/>{'\u00A0'}
            <NavigateButton path={"/products"} text={"View Products"}/>{'\u00A0'}
            <NavigateButton path={"/submitComplaint"} text={"Submit Complaint"}/>{'\u00A0'}
            <NavigateButton path={"/viewTouristAccount"} text={"My profile"}/>{'\u00A0'}
            <NavigateButton path={"/touristBookings"} text={"My Bookings"}/>{'\u00A0'}

            <Logout />
           
        </div>
    );
};

export default TouristAccount;
