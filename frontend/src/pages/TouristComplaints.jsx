import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';

const TouristComplaints = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [complaints, setComplaints] = useState([]); // State to hold the complaints
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch complaints if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchComplaints = async () => {
                try {
                    const response = await axiosInstance.get('/api/complaint/user');
                    setComplaints(response.data);
                } catch (err) {
                    setError('Failed to load complaints.');
                }
            };

            fetchComplaints();
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

            <h2>My Complaints</h2>
            {complaints.length > 0 ? (
                <div>
                    {complaints.map((complaint) => (
                        <div key={complaint._id}>
                            <strong>Title:</strong> {complaint.title}<br />
                            <strong>Body:</strong> {complaint.body}<br />
                            <strong>Status:</strong> {complaint.status}<br />
                            <strong>Date:</strong> {new Date(complaint.date).toLocaleString()}<br />
                            <strong>Reply:</strong> {complaint.reply || 'No reply yet'}<br />
                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                <div>No complaints found.</div>
            )}
        </div>
    );
};

export default TouristComplaints;