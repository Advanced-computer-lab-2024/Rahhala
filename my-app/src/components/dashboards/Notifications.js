import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const Notifications = () => {
    const { auth } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (auth.loading) return; // Wait until auth is fully initialized

            try {
                const userType = auth.user.type; // Assuming user type is stored in auth context
                console.log('userType:', userType);

                const response = await axiosInstance.get(`/api/${userType}/notifications`);
                console.log('Notifications:', response.data);
                setNotifications(response.data);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchNotifications();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    if (auth.loading) {
        return <div>Loading...</div>; // Show a loading indicator while auth is being initialized
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <div className="flex items-center ml-auto space-x-4 relative">
                    <button onClick={toggleDropdown} className="p-2">
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white"></span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                            <ul className="text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide')}>Home</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide-profile')}>Profile</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourGuideSales')}>Sales Report</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourGuideNotifications')}>Notifications</li>
                                <li className="px-4 py-2 hover:bg-red-200 cursor-pointer text-red-600" onClick={() => (window.location.href = '/login')}>Sign Out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex-1 p-6 flex flex-col items-center">
                <div className="space-y-6 w-full max-w-4xl flex flex-col items-center">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                <h3 className="text-lg font-semibold mb-4">Notification {index + 1}</h3>
                                <div className="space-y-2">
                                    <div>
                                        <strong>Itinerary Name:</strong>
                                        <p>{notification.name}</p>
                                    </div>
                                    <div>
                                        <strong>Flagged Reason:</strong>
                                        <p>{notification.flaggedReason}</p>
                                    </div>
                                    <div>
                                        <strong>Date:</strong>
                                        <p>{new Date(notification.flaggedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;