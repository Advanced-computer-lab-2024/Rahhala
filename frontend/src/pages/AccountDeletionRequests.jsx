import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './AccountDeletionRequests.css';

const AccountDeletionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [editRequest, setEditRequest] = useState({ id: '', status: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/api/accountDeletionRequest');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const updateRequest = async () => {
        try {
            await axiosInstance.put(`/api/accountDeletionRequest/${editRequest.id}`, { status: editRequest.status });
            setMessage('Request updated successfully!');
            setEditRequest({ id: '', status: '' });
            fetchRequests(); // Refresh the list after updating
        } catch (error) {
            console.error('Error updating request:', error);
            setMessage('Error updating request.');
        }
    };

    const deleteRequest = async (id) => {
        try {
            await axiosInstance.delete(`/api/accountDeletionRequest/${id}`);
            setMessage('Request deleted successfully!');
            setRequests(requests.filter(request => request._id !== id)); // Remove the deleted request from the state
        } catch (error) {
            console.error('Error deleting request:', error);
            setMessage('Error deleting request.');
        }
    };

    const deleteAccount = async (userType, userId, requestId) => {
        try {
            await axiosInstance.delete(`/api/admin/${userType}/${userId}`);
            await deleteRequest(requestId);
            setMessage('Account deleted and request deleted successfully!');
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage(`Error deleting account: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="account-deletion-requests">
            <h2>Account Deletion Requests</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            {requests.length > 0 ? (
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>User Type</th>
                            <th>User ID</th>
                            <th>Can Be Deleted</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request._id}>
                                <td>{request.userType}</td>
                                <td>{request.userId}</td>
                                <td>{request.canBeDeleted ? 'Yes' : 'No'}</td>
                                <td>
                                    {request.reason}
                                    {!request.canBeDeleted && (
                                        <div>
                                            {request.hasUpcomingEvents && <p>Cannot delete: Upcoming events with paid bookings.</p>}
                                            {request.hasUpcomingActivities && <p>Cannot delete: Upcoming activities with paid bookings.</p>}
                                            {request.hasUpcomingItineraries && <p>Cannot delete: Upcoming itineraries with paid bookings.</p>}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => deleteAccount(request.userType, request.userId, request._id)}>Delete Account</button>
                                    <button onClick={() => deleteRequest(request._id)}>Delete Request</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="loading">Loading requests...</div>
            )}
            {editRequest.id && (
                <div className="controls">
                    <label>
                        Edit Status:
                        <input
                            type="text"
                            value={editRequest.status}
                            onChange={(e) => setEditRequest({ ...editRequest, status: e.target.value })}
                            placeholder="Edit Status"
                        />
                    </label>
                    <button onClick={updateRequest}>Update Request</button>
                </div>
            )}
            <div className="navigation-buttons">
                <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
                <Logout />
            </div>
        </div>
    );
};

export default AccountDeletionRequests;