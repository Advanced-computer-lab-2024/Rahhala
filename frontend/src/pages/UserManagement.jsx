import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './UserManagement.css';

const UserManagement = () => {
    const [pendingUsers, setPendingUsers] = useState({
        tourGuides: [],
        sellers: [],
        advertisers: []
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/viewUsersInfo');
            setPendingUsers({
                tourGuides: response.data.tourGuideDocuments,
                sellers: response.data.sellerDocuments,
                advertisers: response.data.advertiserDocuments
            });
        } catch (error) {
            console.error('Error fetching pending users:', error);
        }
    };

    const acceptUser = async (type, id) => {
        try {
            await axiosInstance.put(`/api/admin/accept${type}/${id}`);
            setMessage(`${type} accepted successfully!`);
            fetchPendingUsers(); // Refresh the list after accepting
        } catch (error) {
            console.error(`Error accepting ${type.toLowerCase()}:`, error);
            setMessage(`Error accepting ${type.toLowerCase()}.`);
        }
    };

    const rejectUser = async (type, id) => {
        try {
            await axiosInstance.put(`/api/admin/reject${type}/${id}`);
            setMessage(`${type} rejected successfully!`);
            fetchPendingUsers(); // Refresh the list after rejecting
        } catch (error) {
            console.error(`Error rejecting ${type.toLowerCase()}:`, error);
            setMessage(`Error rejecting ${type.toLowerCase()}.`);
        }
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            <div className="controls">
                <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
                <Logout />
            </div>
            <h3>Pending Advertisers</h3>
            <p>Below is the list of pending advertisers:</p>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Website Link</th>
                        <th>Hotline</th>
                        <th>Company Profile</th>
                        <th>Logo</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.advertisers.map(advertiser => (
                        <tr key={advertiser._id}>
                            <td>{advertiser.username}</td>
                            <td>{advertiser.email}</td>
                            <td>{advertiser.websiteLink}</td>
                            <td>{advertiser.hotline}</td>
                            <td>{advertiser.companyProfile}</td>
                            <td><img src={advertiser.logo} alt="Logo" width="50" /></td>
                            <td>
                                <button onClick={() => acceptUser('Advertiser', advertiser._id)}>Accept</button>
                                <button onClick={() => rejectUser('Advertiser', advertiser._id)} style={{ marginLeft: '10px' }}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Pending Tour Guides</h3>
            <p>Below is the list of pending tour guides:</p>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Profile Photo</th>
                        <th>Certification Images</th>
                        <th>Previous Work</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.tourGuides.map(tourGuide => (
                        <tr key={tourGuide._id}>
                            <td>{tourGuide.username}</td>
                            <td>{tourGuide.email}</td>
                            <td>{tourGuide.mobileNumber}</td>
                            <td><img src={tourGuide.profilePhoto} alt="Profile" width="50" /></td>
                            <td>
                                {tourGuide.certificationImages.map((image, index) => (
                                    <img key={index} src={image} alt="Certification" width="50" />
                                ))}
                            </td>
                            <td>
                                {tourGuide.previousWork.map((work, index) => (
                                    <div key={index}>
                                        <p>{work.yearsOfExperience} years - {work.work}</p>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button onClick={() => acceptUser('TourGuide', tourGuide._id)}>Accept</button>
                                <button onClick={() => rejectUser('TourGuide', tourGuide._id)} style={{ marginLeft: '10px' }}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Pending Sellers</h3>
            <p>Below is the list of pending sellers:</p>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>ID Card Image</th>
                        <th>Taxation Registry Image</th>
                        <th>Logo</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.sellers.map(seller => (
                        <tr key={seller._id}>
                            <td>{seller.username}</td>
                            <td>{seller.email}</td>
                            <td>{seller.name}</td>
                            <td><img src={seller.idCardImage} alt="ID Card" width="50" /></td>
                            <td><img src={seller.taxationRegistryImage} alt="Taxation Registry" width="50" /></td>
                            <td><img src={seller.logo} alt="Logo" width="50" /></td>
                            <td>{seller.description}</td>
                            <td>
                                <button onClick={() => acceptUser('Seller', seller._id)}>Accept</button>
                                <button onClick={() => rejectUser('Seller', seller._id)} style={{ marginLeft: '10px' }}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;