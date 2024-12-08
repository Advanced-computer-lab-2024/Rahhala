import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const FlagItinerary = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleButtonClick = (path) => {
        navigate(path);
    };

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
            <h2 className="text-2xl font-bold mb-4">Itineraries</h2>
            </div>
        </div>
        </div>
    );
};

export default FlagItinerary;