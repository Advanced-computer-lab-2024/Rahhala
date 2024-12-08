import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const AccountDeletionRequest = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get('/api/accountDeletionRequest');
                const requestsData = response.data;
    
                // Fetch activities, itineraries, and museums
                const [activities, itineraries, museums] = await Promise.all([
                    axiosInstance.get('/api/activity'),
                    axiosInstance.get('/api/itinerary'),
                    axiosInstance.get('/api/museum')
                ]);
    
                const updatedRequests = requestsData.map(request => {
                    const userActivities = activities.data.filter(activity => activity.userId === request.userId && new Date(activity.date) > new Date() && activity.bookingOpen);
                    const userItineraries = itineraries.data.filter(itinerary => itinerary.userId === request.userId && itinerary.availableDates.some(date => new Date(date) > new Date()) && itinerary.isActive);
                    const userMuseums = museums.data.filter(museum => museum.userId === request.userId && new Date(museum.openingHours) > new Date() && museum.bookingOpen);
    
                    let reason = request.reason;
                    if (userActivities.length > 0) {
                        reason = `User has upcoming paid activities: ${userActivities.map(a => a.name).join(', ')}`;
                    } else if (userItineraries.length > 0) {
                        reason = `User has upcoming paid itineraries: ${userItineraries.map(i => i.name).join(', ')}`;
                    } else if (userMuseums.length > 0) {
                        reason = `User has upcoming paid museums: ${userMuseums.map(m => m.name).join(', ')}`;
                    }
    
                    return { ...request, reason };
                });
    
                setRequests(updatedRequests);
                console.log(updatedRequests);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (userId,userType, requestId) => {
        try {
            // Update bookingOpen to false for activities related to the user
            await axiosInstance.put(`/api/activity/updateBookingOpen/${userId}`, { bookingOpen: false });
    
            // Update isActive to false for itineraries related to the user
            await axiosInstance.put(`/api/itinerary/updateIsActive/${userId}`, { isActive: false });
    
            // Delete the user account
            await axiosInstance.delete(`/api/admin/${userType}/${userId}`);
    
            // Delete the account deletion request
            await axiosInstance.delete(`/api/accountDeletionRequest/${requestId}`);
    
            alert('Account deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(`Error deleting account: ${error.response?.data?.message || error.message}`);
        }
    
    }

    const handleReject = async (id) => {
        try {
            await axiosInstance.delete(`/api/accountDeletionRequest/${id}`);
            alert('Request rejected successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert(`Error rejecting request: ${error.response?.data?.message || error.message}`);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl font-bold mb-4">Account Deletion Requests</h2>
                    {requests.map((request) => (
                        <div key={request._id} className="border p-4 rounded-lg">
                            <p><strong>User Type:</strong> {request.userType}</p>
                            <p><strong>User ID:</strong> {request.userId}</p>
                            {request.reason ? <p><strong>Deletable:</strong> No</p>: <p><strong>Deletable:</strong> Yes</p>}
                            {request.reason ? <p className='text-red-700'><strong>Reason:</strong> {request.reason}</p> : null}
                            <p className={`text-${request.status === 'Pending' ? 'yellow' : request.status === 'Approved' ? 'green' : 'red'}-600`}>
                                <strong>Status:</strong> {request.status}
                            </p>
                            <br />
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(request.userId, request.userType, request._id)}
                            >
                                Approve Deletion
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2"
                                onClick={() => handleReject(request._id)}
                            >
                                Reject Deletion
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountDeletionRequest;