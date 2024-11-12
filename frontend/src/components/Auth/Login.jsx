import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavigateButton from '../UpdateProfileButton';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '', // Combined field for username/email
        password: '',
        userType: 'tourist',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Determine if identifier is email or username based on format
            const isEmail = formData.identifier.includes('@');
            
            // Prepare the data based on identifier type
            const loginData = {
                password: formData.password,
                userType: formData.userType,
                // Set either email or username based on the identifier format
                ...(isEmail 
                    ? { email: formData.identifier }
                    : { username: formData.identifier }
                )
            };
            console.log( "login data", loginData);
            const response = await axiosInstance.post('/api/auth/login', loginData);
            const { token } = response.data;

            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            const userType = decoded.userType;
            console.log("userType", userType);
            console.log("decoded", decoded);
            setAuth({
                token,
                isAuthenticated: true,
                loading: false,
                user: {
                    id: decoded.id,
                    type: userType,
                },
            });

            setMessage('Login successful! Redirecting...');
            // add your disired routes here //
            const routes = {
                tourist: '/touristAccount',
                tourguide: '/tourguide-dashboard',
                admin: '/AdminDashboard',
                seller: '/seller-dashboard',
                advertiser: '/advertiser-dashboard',
                tourism_governor: '/GovernorDashboard',

            };
            const targetRoute = routes[userType.toLowerCase()];
            console.log("targetRoute", targetRoute);    
            if (targetRoute) {
                console.log('Navigating to:', targetRoute); // Debugging
                navigate(targetRoute);
            }

        } catch (error) {
            console.error('Login failed:', error);
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email or Username:</label>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Enter email or username"
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
                    <select 
                        name="userType" 
                        value={formData.userType} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="tourist">Tourist</option>
                        <option value="tourguide">Tour Guide</option>
                        <option value="seller">Seller</option>
                        <option value="advertiser">Advertiser</option>
                        <option value="tourism_governor">Tourism Governor</option>
                        <option value="admin">Admin</option>
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