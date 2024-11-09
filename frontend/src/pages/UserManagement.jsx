import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const UserManagement = () => {
    const [pendingAdvertisers, setPendingAdvertisers] = useState([]);
    const [pendingTourGuides, setPendingTourGuides] = useState([]);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const advertisersResponse = await axiosInstance.get('/api/admin/viewPendingAdvertisers');
            const tourGuidesResponse = await axiosInstance.get('/api/admin/viewPendingTourGuides');
            const sellersResponse = await axiosInstance.get('/api/admin/viewPendingSellers');
            setPendingAdvertisers(advertisersResponse.data.advertisers);
            setPendingTourGuides(tourGuidesResponse.data.tourGuides);
            setPendingSellers(sellersResponse.data.sellers);
        } catch (error) {
            console.error('Error fetching pending users:', error);
        }
    };

    const acceptUser = async (type, id) => {
        try {
            console.log(`Accepting ${type.toLowerCase()} with ID: ${id}`);
            const response = await axiosInstance.put(`/api/admin/accept${type}/${id}`);
            console.log('Accept response:', response);
            setMessage(`${type} accepted successfully!`);
            fetchPendingUsers(); // Refresh the list after accepting
        } catch (error) {
            console.error(`Error accepting ${type.toLowerCase()}:`, error);
            setMessage(`Error accepting ${type.toLowerCase()}.`);
        }
    };

    const rejectUser = async (type, id) => {
        try {
            console.log(`Rejecting ${type.toLowerCase()} with ID: ${id}`);
            const response = await axiosInstance.put(`/api/admin/reject${type}/${id}`);
            console.log('Reject response:', response);
            setMessage(`${type} rejected successfully!`);
            fetchPendingUsers(); // Refresh the list after rejecting
        } catch (error) {
            console.error(`Error rejecting ${type.toLowerCase()}:`, error);
            setMessage(`Error rejecting ${type.toLowerCase()}.`);
        }
    };

    return (
        <div>
            <h2>Pending Advertisers</h2>
            {message && <p>{message}</p>}
            <ul>
                {pendingAdvertisers.map(advertiser => (
                    <li key={advertiser._id}>
                        {advertiser.name}
                        <button onClick={() => acceptUser('Advertiser', advertiser._id)}>Accept</button>
                        <button onClick={() => rejectUser('Advertiser', advertiser._id)}>Reject</button>
                    </li>
                ))}
            </ul>
            <h2>Pending Tour Guides</h2>
            <ul>
                {pendingTourGuides.map(tourGuide => (
                    <li key={tourGuide._id}>
                        {tourGuide.name}
                        <button onClick={() => acceptUser('TourGuide', tourGuide._id)}>Accept</button>
                        <button onClick={() => rejectUser('TourGuide', tourGuide._id)}>Reject</button>
                    </li>
                ))}
            </ul>
            <h2>Pending Sellers</h2>
            <ul>
                {pendingSellers.map(seller => (
                    <li key={seller._id}>
                        {seller.name}
                        <button onClick={() => acceptUser('Seller', seller._id)}>Accept</button>
                        <button onClick={() => rejectUser('Seller', seller._id)}>Reject</button>
                    </li>
                ))}
            </ul>
            <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
            <Logout />
        </div>
    );
};

export default UserManagement;