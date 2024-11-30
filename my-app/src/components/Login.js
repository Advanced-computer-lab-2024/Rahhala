import React, { useState, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import loginImage from '../images/pexels-wanderer-731217.jpg';
import backgroundImage from '../images/pexels-codioful-7130504.jpg';

function Login() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
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
      const isEmail = formData.identifier.includes('@');
      const loginData = {
        password: formData.password,
        userType: formData.userType,
        ...(isEmail ? { email: formData.identifier } : { username: formData.identifier }),
      };

      const response = await axiosInstance.post('/api/auth/login', loginData);
      const { token } = response.data;

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      const userType = decoded.userType;

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
      const routes = {
        tourist: '/tourist',
        tourguide: '/tourguide-dashboard',
        admin: '/AdminDashboard',
        seller: '/seller-dashboard',
        advertiser: '/advertiser-dashboard',
        tourism_governor: '/governor',
      };
      const targetRoute = routes[userType.toLowerCase()];
      if (targetRoute) {
        navigate(targetRoute);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg opacity-90">
        <div className="hidden md:flex w-1/2">
          <img 
            src={loginImage} 
            alt="Login" 
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
          {message && <p className="text-center text-red-500">{message}</p>}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Email or Username" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
            <select 
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="tourist">Tourist</option>
              <option value="tourguide">Tour Guide</option>
              <option value="seller">Seller</option>
              <option value="advertiser">Advertiser</option>
              <option value="tourism_governor">Tourism Governor</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              type="submit" 
              className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <button 
            onClick={() => navigate('/guest')} 
            className="w-full p-3 mt-4 text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
          >
            Continue as Guest
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;