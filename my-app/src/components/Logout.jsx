// src/components/Auth/Logout.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
        });
        navigate('/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
