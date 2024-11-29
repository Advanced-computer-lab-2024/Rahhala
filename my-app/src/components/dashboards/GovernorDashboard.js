import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../Header.js';

function GovernorDashboard() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [showCreateMuseumForm, setShowCreateMuseumForm] = useState(false);
  const [showUpdateMuseumForm, setShowUpdateMuseumForm] = useState(false);
  const [showDeleteMuseumForm, setShowDeleteMuseumForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [museumData, setMuseumData] = useState({
    name: '',
    location: '',
    description: '',
    openingHours: '',
    pictures: '',
    tags: '',
    foreignerPrice: 0,
    nativePrice: 0,
    studentPrice: 0,
  });
  const [deleteMuseumName, setDeleteMuseumName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowMuseums = () => {
    navigate('/showAllMuseums');
  };

  const handleShowMuseumTags = () => {
    navigate('/museumTags');
  };

  const handleInputChange = (e) => {
    setMuseumData({
      ...museumData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...museumData,
        pictures: museumData.pictures.split(',').map(picture => picture.trim()),
        tags: museumData.tags.split(',').map(tag => tag.trim())
      };
      await axiosInstance.post('/api/museum/', formattedData);
      setShowCreateMuseumForm(false);
      setSuccessMessage('Museum created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to create museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...museumData,
        pictures: museumData.pictures.split(',').map(picture => picture.trim()),
        tags: museumData.tags.split(',').map(tag => tag.trim())
      };
      await axiosInstance.patch(`/updateMuseumName/${museumData.name}`, formattedData);
      setShowUpdateMuseumForm(false);
      setSuccessMessage('Museum updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to update museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.delete(`/deleteMuseumName/${deleteMuseumName}`);
      setDeleteMuseumName('');
      setShowDeleteMuseumForm(false);
      setSuccessMessage('Museum deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to delete museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/api/governor/changePassword', {
        oldPassword,
        newPassword
      });
      setSuccessMessage('Password changed successfully');
      setErrorMessage(null);
      setOldPassword('');
      setNewPassword('');
      setShowChangePasswordForm(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to change password');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Governor Dashboard</h2>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <div className="flex justify-center space-x-4 mt-4">
          <button onClick={handleShowMuseums} className="bg-blue-500 text-white px-4 py-2 rounded">Show Museums</button>
          <button onClick={() => setShowCreateMuseumForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Create New Museum</button>
          <button onClick={() => setShowUpdateMuseumForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Update Museum</button>
          <button onClick={() => setShowDeleteMuseumForm(true)} className="bg-red-500 text-white px-4 py-2 rounded">Delete Museum</button>
          <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} className="bg-yellow-500 text-white px-4 py-2 rounded">
            {showChangePasswordForm ? 'Cancel' : 'Change My Password'}
          </button>
          <button onClick={handleShowMuseumTags} className="bg-blue-500 text-white px-4 py-2 rounded">Manage Museum Tags</button>
        </div>

        {showChangePasswordForm && (
          <form onSubmit={handleChangePassword} className="mt-4 bg-white p-6 rounded shadow-md max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-gray-700">Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Change Password</button>
          </form>
        )}

        {showCreateMuseumForm && (
          <div className="modal">
            <div className="modal-content bg-white p-6 rounded shadow-md max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Create Museum</h3>
              <form onSubmit={handleCreateMuseumSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={museumData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={museumData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description:</label>
                  <textarea
                    name="description"
                    value={museumData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Pictures (comma separated):</label>
                  <input
                    type="text"
                    name="pictures"
                    value={museumData.pictures}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Opening Hours:</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={museumData.openingHours}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Foreigner Price:</label>
                  <input
                    type="number"
                    name="foreignerPrice"
                    value={museumData.foreignerPrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Native Price:</label>
                  <input
                    type="number"
                    name="nativePrice"
                    value={museumData.nativePrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Student Price:</label>
                  <input
                    type="number"
                    name="studentPrice"
                    value={museumData.studentPrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                <button type="button" onClick={() => setShowCreateMuseumForm(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {showUpdateMuseumForm && (
          <div className="modal">
            <div className="modal-content bg-white p-6 rounded shadow-md max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Update Museum</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={museumData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={museumData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description:</label>
                  <textarea
                    name="description"
                    value={museumData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Pictures (comma separated):</label>
                  <input
                    type="text"
                    name="pictures"
                    value={museumData.pictures}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Opening Hours:</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={museumData.openingHours}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Foreigner Price:</label>
                  <input
                    type="number"
                    name="foreignerPrice"
                    value={museumData.foreignerPrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Native Price:</label>
                  <input
                    type="number"
                    name="nativePrice"
                    value={museumData.nativePrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Student Price:</label>
                  <input
                    type="number"
                    name="studentPrice"
                    value={museumData.studentPrice}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                <button type="button" onClick={() => setShowUpdateMuseumForm(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {showDeleteMuseumForm && (
          <div className="modal">
            <div className="modal-content bg-white p-6 rounded shadow-md max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Delete Museum</h3>
              <form onSubmit={handleDeleteMuseumSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Museum Name:</label>
                  <input
                    type="text"
                    name="deleteMuseumName"
                    value={deleteMuseumName}
                    onChange={(e) => setDeleteMuseumName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                <button type="button" onClick={() => setShowDeleteMuseumForm(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GovernorDashboard;