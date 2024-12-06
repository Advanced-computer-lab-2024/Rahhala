import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import resetPasswordImage from '../images/ResetPassIll.png';
import backgroundImage from '../images/pexels-codioful-7130504.jpg';

function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
    userType: '',
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
      if (step === 1) {
        // Send email to get OTP
        await axiosInstance.post(`/api/${formData.userType}/requestPasswordReset`, { email: formData.email, userType: formData.userType });
        setMessage('OTP sent to your email.');
        setStep(2);
      } else {
        // Verify OTP and reset password
        if (formData.newPassword !== formData.confirmNewPassword) {
          setMessage('Passwords do not match.');
          return;
        }

        await axiosInstance.post(`/api/${formData.userType}/resetPassword`, {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        });

        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      setMessage(error.response?.data?.message || 'Reset password failed.');
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
            src={resetPasswordImage} 
            alt="Reset Password" 
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
          {message && <p className="text-center text-red-500">{message}</p>}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div className="mb-4">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email" 
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
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
                </div>
              </>
              
            ) : (
              <>
                <input 
                  type="text" 
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="OTP" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
                <input 
                  type="password" 
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </>
            )}
            <button 
              type="submit" 
              className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {step === 1 ? 'Send OTP' : 'Reset Password'}
            </button>
          </form>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full p-3 mt-4 text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;