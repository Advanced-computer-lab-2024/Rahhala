import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';
import useLogout from '../../../utils/LogoutUtil';

const DeleteAccount = () => {
    const handleLogout = useLogout();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isTouristVisible, setIsTouristVisible] = useState(true);
    const [isTourGuideVisible, setIsTourGuideVisible] = useState(true);
    const [isSellerVisible, setIsSellerVisible] = useState(true);
    const [isAdvertiserVisible, setIsAdvertiserVisible] = useState(true);
    const [isGovernorVisible, setIsGovernorVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/users');
                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const filterUsers = (users) => {
        return users.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
            user._id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleDelete = async (entityType, id) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/admin/${entityType}/${id}`);
            alert('User deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response.data.message || error.response.data.error || 'Error deleting user.');

        };
    };

    const handleDeleteMyAccount = async () => {
        const confirmed = window.confirm('This Action will delete YOUR OWN ACCOUNT, are you sure you want to procced?');
        if (!confirmed) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/admin/admin/${auth.user.id}`);
            alert('Account deleted successfully');
            handleLogout();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.response.data.message || error.response.data.error || 'Error deleting account.');
        }
    }

    const renderTourists = () => {
        if (!isTouristVisible) {
            return null;
        }
        const touristUsers = filterUsers(users.tourists || []);
        if (!touristUsers.length) {
            return <p>No tourists found.</p>;
        }

        return touristUsers.map((tourist, index) => {
            return (
                <div key={index} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg my-4">
                    <div>
                        <p className="font-bold text-lg">Name: {tourist.username}</p>
                        <p className="text-sm"><strong>ID:</strong> {tourist._id}</p>
                        <p className="text-sm"><strong>Email:</strong> {tourist.email}</p>
                        <p className="text-sm"><strong>Phone Number:</strong> {tourist.mobileNumber}</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete("tourist",tourist._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        });
    };

    const renderTourGuides = () => {
        if (!isTourGuideVisible) {
            return null;
        }
        const tourguideUsers = filterUsers(users.tourGuides || []);
        if (!tourguideUsers.length) {
            return <p>No tour guides found.</p>;
        }
        return tourguideUsers.map((tourguide, index) => {
            return (
                <div key={index} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg my-4">
                    <div>
                        <p className="font-bold text-lg">Name: {tourguide.username}</p>
                        <p className="text-sm"><strong>ID:</strong> {tourguide._id}</p>
                        <p className="text-sm"><strong>Email:</strong> {tourguide.email}</p>
                        <p className="text-sm"><strong>Phone Number:</strong> {tourguide.mobileNumber}</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete("tourguide",tourguide._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        });
    };

    const renderSellers = () => {
        if (!isSellerVisible) {
            return null;
        }
        const sellerUsers = filterUsers(users.sellers || []);
        if (!sellerUsers.length) {
            return <p>No sellers found.</p>;
        }
        return sellerUsers.map((seller, index) => {
            return (
                <div key={index} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg my-4">
                    <div>
                        <p className="font-bold text-lg">Name: {seller.name}</p>
                        <p className="text-sm"><strong>ID:</strong> {seller._id}</p>
                        <p className="text-sm"><strong>Email:</strong> {seller.email}</p>
                        <p className="text-sm"><strong>Phone Number:</strong> {seller.description}</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick= {() => handleDelete("seller",seller._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        });
    };

    const renderAdvertisers = () => {
        if (!isAdvertiserVisible) {
            return null;
        }
        const advertiserUsers = filterUsers(users.advertisers || []);
        if (!advertiserUsers.length) {
            return <p>No advertisers found.</p>;
        }
        return advertiserUsers.map((advertiser, index) => {
            return (
                <div key={index} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg my-4">
                    <div>
                        <p className="font-bold text-lg">Name: {advertiser.username}</p>
                        <p className="text-sm"><strong>ID:</strong> {advertiser._id}</p>
                        <p className="text-sm"><strong>Email:</strong> {advertiser.email}</p>
                        <p className="text-sm"><strong>Hotline:</strong> {advertiser.hotline}</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete("advertiser",advertiser._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        });
    };

    const renderGovernors = () => {
        if (!isGovernorVisible) {
            return null;
        }
        const governorUsers = filterUsers(users.governors || []);
        if (!governorUsers.length) {
            return <p>No governors found.</p>;
        }
        return governorUsers.map((governor, index) => {
            return (
                <div key={index} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg my-4">
                    <div>
                        <p className="font-bold text-lg">Name: {governor.username}</p>
                        <p className="text-sm"><strong>ID:</strong> {governor._id}</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete("governor",governor._id)}
                    >
                        Delete
                    </button>
                </div>
            );
        });
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
                <div className="space-y-4 w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <button 
                        className="w-full px-6 py-3 bg-red-500 text-white rounded text-center mt-4 text-lg"
                        onClick={handleDeleteMyAccount}
                    >
                        Delete <span className='font-bold underline'>MY</span> Account?
                    </button>

                    <h2 className="text-2xl font-bold mb-4">Delete An Account</h2>
                    <input
                        type="text"
                        placeholder="Search by name or ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <h3 className="text-lg text-blue-700 font-bold">Tourists</h3>
                    <p 
                        className="text-gray-600 cursor-pointer underline"
                        onClick={() => setIsTouristVisible(!isTouristVisible)}
                    >
                        {isTouristVisible ? 'Hide Tourists' : 'Show Tourists'}
                    </p>
                    {renderTourists()}
                    <hr className="my-4" />

                    <h3 className="text-lg text-blue-700 font-bold">Tour Guides</h3>
                    <p 
                        className="text-gray-600 cursor-pointer underline"
                        onClick={() => setIsTourGuideVisible(!isTourGuideVisible)}
                    >
                        {isTourGuideVisible ? 'Hide Tour Guides' : 'Show Tour Guides'}
                    </p>
                    {renderTourGuides()}
                    <hr className="my-4" />

                    <h3 className="text-lg text-blue-700 font-bold">Sellers</h3>
                    <p 
                        className="text-gray-600 cursor-pointer underline"
                        onClick={() => setIsSellerVisible(!isSellerVisible)}
                    >
                        {isSellerVisible ? 'Hide Sellers' : 'Show Sellers'}
                    </p>
                    {renderSellers()}
                    <hr className="my-4" />

                    <h3 className="text-lg text-blue-700 font-bold">Advertisers</h3>
                    <p 
                        className="text-gray-600 cursor-pointer underline"
                        onClick={() => setIsAdvertiserVisible(!isAdvertiserVisible)}
                    >
                        {isAdvertiserVisible ? 'Hide Advertisers' : 'Show Advertisers'}
                    </p>
                    {renderAdvertisers()}
                    <hr className="my-4" />

                    <h3 className="text-lg text-blue-700 font-bold">Tourism Governors</h3>
                    <p 
                        className="text-gray-600 cursor-pointer underline"
                        onClick={() => setIsGovernorVisible(!isGovernorVisible)}
                    >
                        {isGovernorVisible ? 'Hide Tourism Governors' : 'Show Tourism Governors'}
                    </p>
                    {renderGovernors()}
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;