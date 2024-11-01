// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig'; // Ensure correct path
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavigateButton from '../UpdateProfileButton';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'tourist', // Default userType
    });

    const [message, setMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/login', formData);
            const { token } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', token);

            // Decode token to extract user information
            const decoded = jwtDecode(token);

            console.log('Decoded Token:', decoded); // Debugging: Log decoded token

            const userId = decoded.id;
            const userType = decoded.userType;

            // Update Auth Context
            setAuth({
                token,
                isAuthenticated: true,
                loading: false,
                user: {
                    id: userId,
                    type: userType,
                },
            });
            console.log(token);

            setMessage('Login successful! Redirecting...');

            // Redirect to a protected route based on userType
            // For example:
            if (userType === 'tourist') {
                navigate('/touristAccount');
            } else if (userType === 'tourguide') {
                navigate('/tourguide-dashboard');
            } 
            else if (userType === 'tourism_governor') {  // New route for Tourism Governor
                navigate('/GovernorDashboard');
            }
            else if (userType === 'admin') { 
                console.log("here") // New route for Tourism Governor
                navigate('/adminDashboard');
            }else if (userType === 'advertiser') {
                navigate('/advertiser-dashboard'); // Default redirect if needed
            }
            else if (userType === 'seller') {
                navigate('/seller-dashboard'); // Default redirect if needed
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email/Username:</label>
                    <input
                        type="String"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>User Type:</label>
                    <select name="userType" value={formData.userType} onChange={handleChange} required>
                        <option value="tourist">Tourist</option>
                        <option value="tourguide">Tour Guide</option>
                        <option value="seller">Seller</option>
                        <option value="advertiser">Advertiser</option>
                        <option value="tourism_governor">Tourism Governor</option>
                        <option value="admin">admin</option>


                    </select>
                </div>
                <br />
                <button type="submit">Login</button>
                <br /><br /><br />
                <NavigateButton path="/register" text="Register" /> {"\u00A0"}
                <NavigateButton path="/guest" text="Continue as Guest" />
            </form>
        </div>
    );
};

export default Login;
