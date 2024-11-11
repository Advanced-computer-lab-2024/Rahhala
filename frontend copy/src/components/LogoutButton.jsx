import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure correct path
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection


const LogoutButton = () => {
    const { logout } = useContext(AuthContext); // Access logout function from AuthContext
    const navigate = useNavigate();


    const handleLogout = () => {
        logout(); 
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
