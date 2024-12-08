import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const AdminDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

      <div className="flex justify-center mt-20">
        <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/new-account-requests')}
          >
            Account Requests
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/settings')}
          >
            Account Deletion Requests
          </button>

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/itineraries')}
          >
            Preference Tags
          </button>
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/reports')}
          >
            Activity Categories
          </button>

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/sales')}
          >
            Sales Reports
          </button>
          <button
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded"
            onClick={() => handleButtonClick('/admin/settings')}
          >
            Complaints
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;