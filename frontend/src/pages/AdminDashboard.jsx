import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

function AdminDashboard() {
    const navigate = useNavigate();
    const [governorData, setGovernorData] = useState({
        username: '',
        password: '',
    });
    const [adminData, setAdminData] = useState({
        username: '',
        password: '',
    });
    const [categoryData, setCategoryData] = useState({
        name: '',
    });
    const [updateCategoryData, setUpdateCategoryData] = useState({
        id: '',
        name: '',
    });
    const [deleteCategoryId, setDeleteCategoryId] = useState(''); // State for category ID to delete
    const [message, setMessage] = useState('');
    const [isGovernorFormVisible, setIsGovernorFormVisible] = useState(false);
    const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);
    const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
    const [isUpdateCategoryFormVisible, setIsUpdateCategoryFormVisible] = useState(false);
    const [isDeleteCategoryFormVisible, setIsDeleteCategoryFormVisible] = useState(false); // New state for delete form

    // Handle input changes for governor form
    const handleGovernorChange = (e) => {
        const { name, value } = e.target;
        setGovernorData({
            ...governorData,
            [name]: value,
        });
    };

    // Handle input changes for admin form
    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value,
        });
    };

    // Handle input changes for category form
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: value,
        });
    };

    // Handle input changes for update category form
    const handleUpdateCategoryChange = (e) => {
        const { name, value } = e.target;
        setUpdateCategoryData({
            ...updateCategoryData,
            [name]: value,
        });
    };

    // Handle input changes for delete category form
    const handleDeleteCategoryChange = (e) => {
        setDeleteCategoryId(e.target.value); // Update delete category ID
    };

    // Handle form submission for governor
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

    // Handle form submission for admin
    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axiosInstance.post('/api/admin/addAdmin', adminData); 
            setMessage('Admin added successfully!');
            setAdminData({ username: '', password: '' }); 
            setIsAdminFormVisible(false); 
        } catch (error) {
            console.error('Error adding admin:', error.response || error.message);
            setMessage(error.response?.data?.message || 'Failed to add Admin.');
        }
    };

    // Handle form submission for category
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

    // Handle form submission for updating a category
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

    // Handle form submission for deleting a category
    const handleDeleteCategorySubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.delete(`/api/activityCategory/${deleteCategoryId}`);
            setMessage('Category deleted successfully!');
            setDeleteCategoryId(''); // Reset form
            setIsDeleteCategoryFormVisible(false); // Hide the form after submission
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete category.');
        }
    };

    // Toggle governor form visibility
    const toggleGovernorForm = () => {
        setIsGovernorFormVisible(!isGovernorFormVisible);
        setMessage('');
    };

    // Toggle admin form visibility
    const toggleAdminForm = () => {
        setIsAdminFormVisible(!isAdminFormVisible);
        setMessage('');
    };

    // Toggle category form visibility
    const toggleCategoryForm = () => {
        setIsCategoryFormVisible(!isCategoryFormVisible);
        setMessage('');
    };

    // Toggle update category form visibility
    const toggleUpdateCategoryForm = () => {
        setIsUpdateCategoryFormVisible(!isUpdateCategoryFormVisible);
        setMessage('');
    };

    // Toggle delete category form visibility
    const toggleDeleteCategoryForm = () => {
        setIsDeleteCategoryFormVisible(!isDeleteCategoryFormVisible);
        setMessage('');
    };

    // Effect to clear message after 3 seconds
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

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            
            {/* Button to toggle Category form */}
            <button onClick={toggleCategoryForm}>
                {isCategoryFormVisible ? 'Cancel' : 'Add Category'}
            </button>
            {isCategoryFormVisible && (
                <form onSubmit={handleCategorySubmit}>
                    <div>
                        <label>Category Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={categoryData.name}
                            onChange={handleCategoryChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Add Category</button>
                </form>
            )}

            {/* Button to toggle Update Category form */}
            <button onClick={toggleUpdateCategoryForm}>
                {isUpdateCategoryFormVisible ? 'Cancel' : 'Update Category'}
            </button>
            {isUpdateCategoryFormVisible && (
                <form onSubmit={handleUpdateCategorySubmit}>
                    <div>
                        <label>Category ID:</label>
                        <input
                            type="text"
                            name="id"
                            value={updateCategoryData.id}
                            onChange={handleUpdateCategoryChange}
                            required
                        />
                    </div>
                    <div>
                        <label>New Category Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={updateCategoryData.name}
                            onChange={handleUpdateCategoryChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Update Category</button>
                </form>
            )}

            {/* Button to toggle Delete Category form */}
            <button onClick={toggleDeleteCategoryForm}>
                {isDeleteCategoryFormVisible ? 'Cancel' : 'Delete Category'}
            </button>
            {isDeleteCategoryFormVisible && (
                <form onSubmit={handleDeleteCategorySubmit}>
                    <div>
                        <label>Category ID:</label>
                        <input
                            type="text"
                            value={deleteCategoryId}
                            onChange={handleDeleteCategoryChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Delete Category</button>
                </form>
            )}

            {/* Button to toggle Governor form */}
            <button onClick={handleShowCategories}>Show All Categories</button>

            <button onClick={toggleGovernorForm}>
                {isGovernorFormVisible ? 'Cancel' : 'Add Tourism Governor'}
            </button>
            {isGovernorFormVisible && (
                <form onSubmit={handleGovernorSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={governorData.username}
                            onChange={handleGovernorChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={governorData.password}
                            onChange={handleGovernorChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Add Tourism Governor</button>
                </form>
            )}

            <button onClick={toggleAdminForm}>
                {isAdminFormVisible ? 'Cancel' : 'Add Admin'}
            </button>
            {isAdminFormVisible && (
                <form onSubmit={handleAdminSubmit}>
                    <div>
                        <label>Username: </label>
                        <input
                            type="username"
                            name="username"
                            value={adminData.username}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input
                            type="password"
                            name="password"
                            value={adminData.password}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Add Admin</button>
                </form>
            )}
            <NavigateButton path="/products" text="View Products" />
            <NavigateButton path='/createProduct' text='Create Product'/>
            <Logout/>
        </div>
    );
}

export default AdminDashboard;