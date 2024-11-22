import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/pexels-wanderer-731217.jpg';
import backgroundImage from '../images/pexels-codioful-7130504.jpg';
import axiosInstance from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../utils/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [userType, setUserType] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        // Determine if identifier is email or username based on format
        const isEmail = emailOrUsername.includes('@');
        
        // Prepare the data based on identifier type
        const loginData = {
            password: password,
            userType: userType,
            // Set either email or username based on the identifier format
            ...(isEmail 
                ? { email: emailOrUsername }
                : { username: emailOrUsername }
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

  const handleGuest = () => {
    navigate('/home');
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
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <input 
              onChange={(e) => setEmailOrUsername(e.target.value)}
              type="text" 
              placeholder="Email or Username" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input 
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <select 
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select User Type</option>
              <option value="tourist">Tourist</option>
              <option value="tour_guide">Tour Guide</option>
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
            onClick={handleGuest} 
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
