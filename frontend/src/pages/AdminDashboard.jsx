import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import ChangePassword from './ChangePassword';
import ViewDocuments from '../components/ViewDocuments';
import DeleteAccount from '../components/DeleteAccount';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [governorData, setGovernorData] = useState({ username: '', password: '' });
    const [adminData, setAdminData] = useState({ username: '', password: '' });
    const [categoryData, setCategoryData] = useState({ name: '' });
    const [updateCategoryData, setUpdateCategoryData] = useState({ id: '', name: '' });
    const [deleteCategoryId, setDeleteCategoryId] = useState('');
    const [message, setMessage] = useState('');
    const [isGovernorFormVisible, setIsGovernorFormVisible] = useState(false);
    const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);
    const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
    const [isUpdateCategoryFormVisible, setIsUpdateCategoryFormVisible] = useState(false);
    const [isDeleteCategoryFormVisible, setIsDeleteCategoryFormVisible] = useState(false);
    const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] = useState(false);
    const [isDeleteAccountFormVisible, setIsDeleteAccountFormVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const hideAllForms = () => {
        setIsGovernorFormVisible(false);
        setIsAdminFormVisible(false);
        setIsCategoryFormVisible(false);
        setIsUpdateCategoryFormVisible(false);
        setIsDeleteCategoryFormVisible(false);
        setIsChangePasswordFormVisible(false);
        setIsDeleteAccountFormVisible(false);
    };

    const toggleGovernorForm = () => {
        hideAllForms();
        setIsGovernorFormVisible(!isGovernorFormVisible);
        setMessage('');
    };

    const toggleAdminForm = () => {
        hideAllForms();
        setIsAdminFormVisible(!isAdminFormVisible);
        setMessage('');
    };

    const toggleCategoryForm = () => {
        hideAllForms();
        setIsCategoryFormVisible(!isCategoryFormVisible);
        setMessage('');
    };

    const toggleUpdateCategoryForm = () => {
        hideAllForms();
        setIsUpdateCategoryFormVisible(!isUpdateCategoryFormVisible);
        setMessage('');
    };

    const toggleDeleteCategoryForm = () => {
        hideAllForms();
        setIsDeleteCategoryFormVisible(!isDeleteCategoryFormVisible);
        setMessage('');
    };

    const toggleChangePasswordForm = () => {
        hideAllForms();
        setIsChangePasswordFormVisible(!isChangePasswordFormVisible);
        setMessage('');
    };

    const toggleDeleteAccountForm = () => {
        hideAllForms();
        setIsDeleteAccountFormVisible(!isDeleteAccountFormVisible);
        setMessage('');
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleShowCategories = () => {
        navigate('/ActivityCategories');
    };

    const handleGovernorSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/governor', governorData);
            setMessage('Tourism Governor added successfully!');
            setGovernorData({ username: '', password: '' });
            setIsGovernorFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Tourism Governor.');
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/admin/', adminData);
            setMessage('Admin added successfully!');
            setAdminData({ username: '', password: '' });
            setIsAdminFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Admin.');
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/activityCategory', categoryData);
            setMessage('Category added successfully!');
            setCategoryData({ name: '' });
            setIsCategoryFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add category.');
        }
    };

    const handleUpdateCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/activityCategory/${updateCategoryData.id}`, { name: updateCategoryData.name });
            setMessage('Category updated successfully!');
            setUpdateCategoryData({ id: '', name: '' });
            setIsUpdateCategoryFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update category.');
        }
    };

    const handleDeleteCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.delete(`/api/activityCategory/${deleteCategoryId}`);
            setMessage('Category deleted successfully!');
            setDeleteCategoryId('');
            setIsDeleteCategoryFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete category.');
        }
    };

    const handleChangePassword = async (currentPassword, newPassword, confirmNewPassword) => {
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        try {
            await axiosInstance.put('/api/admin/changePassword', { oldPassword: currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsChangePasswordFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to change password.');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {message && <p className="message">{message}</p>}
            
            <div className="buttons">
                <button onClick={toggleCategoryForm}>
                    {isCategoryFormVisible ? 'Cancel' : 'Add Category'}
                </button>
                <button onClick={toggleUpdateCategoryForm}>
                    {isUpdateCategoryFormVisible ? 'Cancel' : 'Update Category'}
                </button>
                <button onClick={toggleDeleteCategoryForm}>
                    {isDeleteCategoryFormVisible ? 'Cancel' : 'Delete Category'}
                </button>
                <button onClick={handleShowCategories}>Show All Categories</button>
                <button onClick={toggleGovernorForm}>
                    {isGovernorFormVisible ? 'Cancel' : 'Add Tourism Governor'}
                </button>
                <button onClick={toggleAdminForm}>
                    {isAdminFormVisible ? 'Cancel' : 'Add Admin'}
                </button>
                <button onClick={toggleChangePasswordForm}>
                    {isChangePasswordFormVisible ? 'Cancel' : 'Change Password'}
                </button>
                <button onClick={toggleDeleteAccountForm}>
                    {isDeleteAccountFormVisible ? 'Cancel' : 'Delete Account'}
                </button>
            </div>

            <div className="form-container">
                {isCategoryFormVisible && (
                    <form onSubmit={handleCategorySubmit}>
                        <div>
                            <label>Category Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={categoryData.name}
                                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Category</button>
                    </form>
                )}

                {isUpdateCategoryFormVisible && (
                    <form onSubmit={handleUpdateCategorySubmit}>
                        <div>
                            <label>Category ID:</label>
                            <input
                                type="text"
                                name="id"
                                value={updateCategoryData.id}
                                onChange={(e) => setUpdateCategoryData({ ...updateCategoryData, id: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>New Category Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={updateCategoryData.name}
                                onChange={(e) => setUpdateCategoryData({ ...updateCategoryData, name: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Update Category</button>
                    </form>
                )}

                {isDeleteCategoryFormVisible && (
                    <form onSubmit={handleDeleteCategorySubmit}>
                        <div>
                            <label>Category ID:</label>
                            <input
                                type="text"
                                value={deleteCategoryId}
                                onChange={(e) => setDeleteCategoryId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Delete Category</button>
                    </form>
                )}

                {isGovernorFormVisible && (
                    <form onSubmit={handleGovernorSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={governorData.username}
                                onChange={(e) => setGovernorData({ ...governorData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={governorData.password}
                                onChange={(e) => setGovernorData({ ...governorData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Tourism Governor</button>
                    </form>
                )}

                {isAdminFormVisible && (
                    <form onSubmit={handleAdminSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={adminData.username}
                                onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={adminData.password}
                                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Admin</button>
                    </form>
                )}

                {isChangePasswordFormVisible && (
                    <ChangePassword
                        userRole="admin"
                        handleChangePassword={handleChangePassword}
                    />
                )}

                {isDeleteAccountFormVisible && (
                    <DeleteAccount />
                )}
            </div>

            <div className="section">
                <h3>Product Management</h3>
                <div className="buttons">
                    <NavigateButton path="/products" text="View Products" />
                    <NavigateButton path='/createProduct' text='Create Product'/>
                </div>
            </div>

            <div className="section">
                <h3>Users Management</h3>
                <div className="buttons">
                    <NavigateButton path="/viewPendingUsers" text="View Pending Users" />
                </div>
            </div>

            <div className="section">
                <h3>Others</h3>
                <Logout />
            </div>
        </div>
    );
}

export default AdminDashboard;