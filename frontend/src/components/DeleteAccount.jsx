import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const DeleteAccount = () => {
    const [userId, setUserId] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.delete(`/api/admin/${userType}/${userId}`);
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting account');
            setMessage('');
        }
    };

    return (
        <div>
            <h3>Delete Account</h3>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleDeleteAccount}>
                <div>
                    <label>User ID:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>User Type:</label>
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="admin">Admin</option>
                        <option value="governor">Governor</option>
                        <option value="tourist">Tourist</option>
                        <option value="tourGuide">Tour Guide</option>
                        <option value="advertiser">Advertiser</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <button type="submit">Delete Account</button>
            </form>
        </div>
    );
};

export default DeleteAccount;