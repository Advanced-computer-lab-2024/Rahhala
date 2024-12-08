import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';
import { set } from 'mongoose';

const AdminDashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const {auth} = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/api/admin');
                setUser(response.data.admin);
                console.log("resp",response.data.admin);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [auth]);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleButtonClick = (path) => {
        navigate(path);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(currentPassword, user.password)
        try{
            if(currentPassword!==user.password){
                alert('Current password is incorrect');
                return;
            }
            if(newPassword!==confirmPassword){
                alert('New password and confirm password do not match');
                return;
            }
            await axiosInstance.put('/api/admin/changePassword', { oldPassword: currentPassword, newPassword: newPassword });

            setPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert('Password changed successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error changing password:', error);
            alert(error.response.data.message || error.response.data.error || 'Error changing password.');
        }
    }

    const renderPasswordModal = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
                <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter Current password"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    Change Password
                </button>
                <button
                    className="w-full bg-red-600 text-white p-2 rounded mt-4"
                    onClick={() => {
                        setPasswordModalOpen(false)
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                    }}
                >
                    Cancel
                </button>
                </form>
            </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

        <div className="flex justify-center mt-20">
            <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
            <p 
                className="text-blue-600 cursor-pointer underline text-center"
                onClick={() => setPasswordModalOpen(true)}
            >
                Change Password
            </p>
            {passwordModalOpen && renderPasswordModal()}
            <button
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => handleButtonClick('/admin/management')}
            >
                management
            </button>
            <button
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => handleButtonClick('/admin/add-user')}
            >
                Add User
            </button>
  
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/sales')}
          >
            Sales Reports
          </button>
          <button
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={() => handleButtonClick('/admin/delete-account')}
            >
                Delete an Account
            </button>


            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;