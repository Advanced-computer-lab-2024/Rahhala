// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig'; // Ensure correct path
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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

            setMessage('Login successful! Redirecting...');

            // Redirect to a protected route based on userType
            // For example:
            if (userType === 'tourist') {
                navigate('/tourist-dashboard');
            }    
            else {
                navigate('/'); // Default redirect
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
                    <label>Email:</label>
                    <input
                        type="email"
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
                    </select>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
