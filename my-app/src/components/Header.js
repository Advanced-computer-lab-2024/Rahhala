import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../utils/LogoutUtil';
import { AuthContext } from '../context/AuthContext'; // Add this import

const Header = () => {
    const handleLogout = useLogout();
    const { auth } = useContext(AuthContext); // Add this line
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <div className="flex items-center ml-auto space-x-4 relative">
                {/* Rest of the header code remains the same */}
                <button onClick={toggleDropdown} className="p-2">
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white mb-1"></span>
                    <span className="block w-6 h-1 bg-white"></span>
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                        <ul className="text-sm text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourist')}>Home</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourist-profile')}>Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourist-booking')}>Bookings</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/flights')}>Flights</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourist-wallet')}>Wallet</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/products')}>Products</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourist-orders')}>My Orders</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/redeem')}>Redeem</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/complaints')}>Complaints</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/Notifications')}>Notifications</li>
                            <li className="px-4 py-2 hover:bg-red-200 cursor-pointer text-red-600" onClick={() => (handleLogout())}>Sign Out</li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;