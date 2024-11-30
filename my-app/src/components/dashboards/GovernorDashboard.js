import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../Header.js';

function GovernorDashboard() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [activeForm, setActiveForm] = useState(null); // 'create', 'update', 'delete', 'password', or null
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
  const [museums, setMuseums] = useState([]);
  const [showMuseums, setShowMuseums] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Update fetchTags to store both ID and name
  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/api/museumTags');
      const tags = response.data.map(tag => ({
        _id: tag._id,
        name: `${tag.type} - ${tag.historicalPeriod}`
      }));
      setAvailableTags(tags);
    } catch (err) {
      setErrorMessage('Failed to fetch tags.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleShowMuseums = async () => {
    try {
      const response = await axiosInstance.get('/api/museum/');
      setMuseums(response.data);
      setShowMuseums(!showMuseums);
      setActiveForm('museums');
    } catch (err) {
      setErrorMessage('Failed to fetch museums.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  const [expandedMuseum, setExpandedMuseum] = useState(null);

  const handleMoreInfoMuseum = (id) => {
    setExpandedMuseum(expandedMuseum === id ? null : id);
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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Array = await Promise.all(files.map(fileToBase64));
    setImageFiles(files);
    setMuseumData({
      ...museumData,
      pictures: base64Array
    });
  };

  // Update handleTagSelect to store tag IDs
  const handleTagSelect = (e) => {
    const selectedTagIds = Array.from(e.target.selectedOptions, option => option.value);
    setMuseumData({
      ...museumData,
      tags: selectedTagIds
    });
  };

  // Update handleCreateMuseumSubmit
  const handleCreateMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...museumData,
        // Tags are already ObjectIds from select
        tags: Array.isArray(museumData.tags) ? museumData.tags : []
      };
      
      await axiosInstance.post('/api/museum/', formattedData);
      setActiveForm(null);
      setSuccessMessage('Museum created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setMuseumData({
        name: '',
        location: '',
        description: '',
        openingHours: '',
        pictures: '',
        tags: [],
        foreignerPrice: 0,
        nativePrice: 0,
        studentPrice: 0,
      });
      setImageFiles([]);
      
    } catch (err) {
      console.error('Error creating museum:', err);
      setErrorMessage('Failed to create museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Update handleUpdateSubmit to match create logic
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format data to match model requirements
      const formattedData = {
        name: museumData.name,
        description: museumData.description,
        location: museumData.location,
        openingHours: museumData.openingHours,
        pictures: museumData.pictures,
        foreignerPrice: Number(museumData.foreignerPrice),
        nativePrice: Number(museumData.nativePrice),
        studentPrice: Number(museumData.studentPrice),
        tags: museumData.tags,
        userId: auth.id // Add userId from auth context
      };
  
      console.log('Updating museum with data:', formattedData);
  
      // Use PUT instead of PATCH to match route
      const response = await axiosInstance.put(`/api/museum/${museumData._id}`, formattedData);
      console.log('Update response:', response);
  
      if (response.status === 200) {
        setActiveForm(null);
        setSuccessMessage('Museum updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleShowMuseums(); // Refresh list
        
        // Reset form
        setMuseumData({
          name: '',
          location: '',
          description: '',
          openingHours: '',
          pictures: '',
          tags: [],
          foreignerPrice: 0,
          nativePrice: 0,
          studentPrice: 0,
        });
        setImageFiles([]);
      }
    } catch (err) {
      console.error('Error updating museum:', err.response?.data || err);
      setErrorMessage(err.response?.data?.message || 'Failed to update museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.delete(`/deleteMuseumName/${deleteMuseumName}`);
      setDeleteMuseumName('');
      setActiveForm(null);
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
      setActiveForm(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to change password');
      setSuccessMessage(null);
    }
  };

  const handleFormChange = (formName) => {
    setActiveForm(activeForm === formName ? null : formName);
    // Reset form data when switching forms
    if (formName !== 'delete') {
      setMuseumData({
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
    }
    setDeleteMuseumName('');
    setOldPassword('');
    setNewPassword('');
  };

  // Update handleEditMuseum to properly format data
  const handleEditMuseum = (museum) => {
    setMuseumData({
      ...museum,
      // Ensure properly formatted tags array
      tags: museum.tags.map(tag => 
        typeof tag === 'string' ? tag : tag._id
      )
    });
    setActiveForm('update');
  };

  // Add removeImage handler
  const removeImage = (index) => {
    setMuseumData(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <div className="flex justify-center space-x-4 mt-4">
          <button 
            onClick={handleShowMuseums} 
            className={`px-4 py-2 rounded ${activeForm === 'museums' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Show Museums
          </button>
          <button 
            onClick={() => handleFormChange('create')} 
            className={`px-4 py-2 rounded ${activeForm === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Create New Museum
          </button>
          <button 
            onClick={() => handleFormChange('delete')} 
            className={`px-4 py-2 rounded ${activeForm === 'delete' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Delete Museum
          </button>
          <button 
            onClick={() => handleFormChange('password')}
            className={`px-4 py-2 rounded ${activeForm === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Change My Password
          </button>
          <button 
            onClick={handleShowMuseumTags} 
            className={`px-4 py-2 rounded ${activeForm === 'tags' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Manage Museum Tags
          </button>
        </div>

        {activeForm && activeForm !== 'museums' && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              {activeForm === 'password' && (
                <form onSubmit={handleChangePassword}>
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
              
              {activeForm === 'create' && (
                <div className="modal">
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
                      <label className="block text-gray-700">Pictures:</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {imageFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {imageFiles.map((file, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
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
                      <label className="block text-gray-700">Tags:</label>
                      <select
                        multiple
                        name="tags"
                        value={museumData.tags}
                        onChange={handleTagSelect}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {availableTags.map(tag => (
                          <option key={tag._id} value={tag._id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Foreigner Price:</label>
                      <input
                        type="number"
                        name="foreignerPrice"
                        min="0"
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
                        min="0"
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
                        min="0"
                        value={museumData.studentPrice}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                    <button type="button" onClick={() => setActiveForm(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  </form>
                </div>
              )}
              
              {activeForm === 'update' && (
                <div className="modal">
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
                      <label className="block text-gray-700">Pictures:</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <div className="mt-4">
                        <label className="block text-gray-700 mb-2">Current Images:</label>
                        <div className="grid grid-cols-2 gap-4">
                          {museumData.pictures.map((image, idx) => (
                            <div key={idx} className="relative">
                              <img 
                                src={image} 
                                alt={`Museum ${idx + 1}`}
                                className="w-full h-40 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
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
                      <label className="block text-gray-700">Tags:</label>
                      <select
                        multiple
                        name="tags"
                        value={museumData.tags}
                        onChange={handleTagSelect}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {availableTags.map(tag => (
                          <option key={tag._id} value={tag._id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700">Foreigner Price:</label>
                      <input
                        type="number"
                        name="foreignerPrice"
                        min="0"
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
                        min="0"
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
                        min="0"
                        value={museumData.studentPrice}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                    <button type="button" onClick={() => setActiveForm(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  </form>
                </div>
              )}
              
              {activeForm === 'delete' && (
                <div className="modal">
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
                    <button type="button" onClick={() => setActiveForm(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {activeForm === 'museums' && (
          <div className="space-y-4 max-w-md mx-auto mt-6">
            <h2 className="text-2xl font-bold">Museums List</h2>
            {museums.map((museum) => (
              <div key={museum._id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-xl font-semibold">{museum.name}</h3>
                <p>{museum.description}</p>
                <p>Location: {museum.location}</p>
                <p>Opening Hours: {museum.openingHours}</p>
                <p>Foreigner Price: ${museum.foreignerPrice}</p>
                <p>Native Price: ${museum.nativePrice}</p>
                <p>Student Price: ${museum.studentPrice}</p>
                <p>Tags: {museum.tags.join(', ')}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleMoreInfoMuseum(museum._id)}
                  >
                    More Info
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    onClick={() => handleEditMuseum(museum)}
                  >
                    Edit Museum
                  </button>
                </div>
                {expandedMuseum === museum._id && (
                  <div className="mt-4 text-gray-700">
                    <h4 className="font-semibold">Images</h4>
                    <div className="flex space-x-2 mt-2 overflow-x-auto">
                      {museum.pictures.map((base64Image, idx) => (
                        <img 
                          key={idx} 
                          src={base64Image} 
                          alt={`${museum.name} ${idx + 1}`} 
                          className="w-40 h-40 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GovernorDashboard;