import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const AddUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [governorModalOpen, setGovernorModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAddAdmin = async () => {
        try {
            await axiosInstance.post('/api/admin', { username, password });
            alert('Admin added successfully!');
            setUsername('');
            setPassword('');
            setAdminModalOpen(false);
        } catch (error) {
            console.error('Error adding admin:', error);
            alert(error.response.data.message || error.response.data.error || 'Error adding admin.');
        }
    }

    const renderAdminModal = () => {
        return(
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">New Admin</h2>
                    <input
                        className="border border-gray-400 p-2 rounded w-full mb-4"
                        type="text"
                        placeholder="Username"
                        value = {username}
                        onChange = {(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border border-gray-400 p-2 rounded w-full mb-4"
                        type="password"
                        placeholder="Password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                        onClick={handleAddAdmin}
                    >
                        Add Admin
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
                        onClick={() => setAdminModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }


    const handleAddGoverner = async () => {
        try {
            await axiosInstance.post('/api/governor', { username, password });
            alert('Governor added successfully!');
            setUsername('');
            setPassword('');
            setGovernorModalOpen(false);
        } catch (error) {
            console.error('Error adding governor:', error);
            alert(error.response.data.message || error.response.data.error || 'Error adding governor.');
        }
    }

    const renderGovernorModal = () => {
        return(
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">New Governer</h2>
                    <input
                        className="border border-gray-400 p-2 rounded w-full mb-4"
                        type="text"
                        placeholder="Username"
                        value = {username}
                        onChange = {(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border border-gray-400 p-2 rounded w-full mb-4"
                        type="password"
                        placeholder="Password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                        onClick={handleAddGoverner}
                    >
                        Add Governer
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
                        onClick={() => setGovernorModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )

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
                    <h2 className="text-2xl font-bold mb-4 text-center">Add User</h2>
                    {adminModalOpen && renderAdminModal()}
                    {governorModalOpen && renderGovernorModal()}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                        onClick= {() => {
                            setAdminModalOpen(true)
                            setGovernorModalOpen(false);
                        }}
                    >
                        Add Admin
                    </button>
                    &nbsp;
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                        onClick= {() => {
                            setGovernorModalOpen(true)
                            setAdminModalOpen(false);
                        }}
                    >
                        Add Tourism Governor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUser;