import React, { useState, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = ({ userType, userId }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axiosInstance.delete(`/api/admin/${userType}/${userId}`);
            setMessage(response.data.message);
            setError('');
            logout();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting account');
            setMessage('');
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token'); 
        setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
        });
        navigate('/login');
    };

    return (
        <div> 
            <h3>Delete Account</h3>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleDeleteAccount}>
                <button type="submit">Delete Account</button>
            </form>
        </div>
    );
};

export default DeleteAccount;