// src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        userType: 'tourist',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', formData);
            const { token } = response.data;
            setAuth(token);
            localStorage.setItem('token', token);
            setMessage('Login successful!');
            navigate('/itineraries'); // Redirect to a protected route
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div>
            <h2>Login as Tourist</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="userType" value="tourist" />
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
