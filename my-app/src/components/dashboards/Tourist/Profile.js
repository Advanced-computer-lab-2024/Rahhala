import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from '../../Header.js';
import { SpinnerCircular } from 'spinners-react'; // You'll need to install this package
// Add these constants at the top of your file
const ARAB_NATIONALITIES = [
  "Algerian",
  "Bahraini",
  "Comoran",
  "Djiboutian",
  "Egyptian",
  "Emirati",
  "Iraqi",
  "Jordanian",
  "Kuwaiti",
  "Lebanese",
  "Libyan",
  "Mauritanian",
  "Moroccan",
  "Omani",
  "Palestinian",
  "Qatari",
  "Saudi Arabian",
  "Somali",
  "Sudanese",
  "Syrian",
  "Tunisian",
  "Yemeni"
].sort();

const TouristProfile = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState(1);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userPreferences, setUserPreferences] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [currentLoyaltyPoints, setCurrentLoyaltyPoints] = useState(0);
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState(0);
  // First add a loading state for each operation
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [filteredTags, setFilteredTags] = useState(preferenceTags);
  // Helper component for displaying info items
  const InfoItem = ({ label, value, icon }) => (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-blue-600">{icon}</span>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className="text-gray-900 font-medium pl-8">
        {label === 'Mobile Number' && value ? `+20 ${value}` :
          label === 'Preferences' && Array.isArray(value) ?
            value.length > 0 ? value : 'No preferences selected' :
            value || 'Not specified'}
      </p>
    </div>
  );

  // First add these new states at the top with other useState declarations
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  // Update calculateLevel function
  const calculateLevel = (points) => {
    if (!points) return { level: 1, progress: 0, nextThreshold: 10000 };

    const thresholds = {
      1: { min: 0, max: 10000 },
      2: { min: 10000, max: 50000 },
      3: { min: 50000, max: Infinity }
    };

    for (const [level, { min, max }] of Object.entries(thresholds)) {
      if (points >= min && points < max) {
        const progress = ((points - min) / (max - min)) * 100;
        return {
          level: parseInt(level),
          progress: Math.min(progress, 100),
          nextThreshold: max === Infinity ? null : max
        };
      }
    }
  };
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const fetchProfile = async () => {
        try {
          const [profileRes, tagsRes] = await Promise.all([
            axiosInstance.get('/api/tourist/'),
            axiosInstance.get('/api/preferenceTag')
          ]);

          const levelInfo = calculateLevel(profileRes.data.profile.totalLoyaltyPoints);
          setLevel(levelInfo);
          setUser(profileRes.data.profile);
          setUpdatedUser(profileRes.data.profile);
          setPreferenceTags(tagsRes.data);
          setCurrentLoyaltyPoints(profileRes.data.profile.currentLoyaltyPoints);
          setTotalLoyaltyPoints(profileRes.data.profile.totalLoyaltyPoints);
        } catch (err) {
          setError('Failed to load profile data');
        }
      };
      fetchProfile();
    }
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };


  const handleCheckboxChange = (tagId) => {
    setUpdatedUser((prev) => {
      const newPreferences = prev.preferences.some((tag) => tag._id === tagId)
        ? prev.preferences.filter((tag) => tag._id !== tagId)
        : [...prev.preferences, preferenceTags.find((tag) => tag._id === tagId)];
      return { ...prev, preferences: newPreferences };
    });
  };

  // Add this new component inside TouristProfile before the return statement
  const Toast = ({ message, type }) => (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className={`rounded-lg px-4 py-3 shadow-lg ${type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
          type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
            'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
        <div className="flex items-center space-x-3">
          {type === 'success' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : type === 'error' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );

  // Add this helper function
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Update handleSubmit to include feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const preferencesIds = updatedUser.preferences.map((tag) => tag._id);
      const updatedUserWithIds = { ...updatedUser, preferences: preferencesIds };

      await axiosInstance.put(`/api/tourist/edit/${auth.user._id}`, updatedUserWithIds);
      const response = await axiosInstance.get('/api/tourist/');
      const preferenceTagsResponse = await axiosInstance.get('/api/preferenceTag');
      const preferenceTags = preferenceTagsResponse.data;
      response.data.profile.preferences = response.data.profile.preferences.map((preferenceId) => {
        const tag = preferenceTags.find((tag) => tag._id === preferenceId);
        return tag ? tag.name : preferenceId;
      });

      setUser(response.data.profile);
      setUpdatedUser(response.data.profile);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      setError('Failed to update profile.');
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      await axiosInstance.put('/api/tourist/changePassword', {
        oldPassword: currentPassword,
        newPassword,
      });
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast('Password changed successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.error || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRequestAccountDeletion = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to request account deletion? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      await axiosInstance.post('/api/accountDeletionRequest', {});
      showToast('Account deletion request submitted successfully', 'success');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        showToast('This Account already made an account deletion request', 'error');
      } else {
        showToast('Failed to request account deletion', 'error');
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleImageClick = (src) => {
    setModalImageSrc(src);
    setShowImageModal(true);
  };

  // Add this new function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Update handleProfilePictureChange to include feedback
  const handleProfilePictureChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5000000) {
          showToast('Image size should be less than 5MB', 'error');
          return;
        }
        setIsUploadingImage(true);
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
        const base64 = await convertToBase64(file);
        setUpdatedUser(prev => ({
          ...prev,
          profilePicture: base64
        }));
      }
    } catch (error) {
      console.error("Error converting image:", error);
      showToast('Failed to process image', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setUpdatedUser((prev) => ({
        ...prev,
        deliveryAddresses: [...prev.deliveryAddresses, newAddress.trim()],
      }));
      setNewAddress('');
    }
  };

  const handleRemoveAddress = (index) => {
    setUpdatedUser((prev) => ({
      ...prev,
      deliveryAddresses: prev.deliveryAddresses.filter((_, i) => i !== index),
    }));
  };

  const getPointsMultiplier = (level) => {
    switch (level) {
      case 1: return 0.5;
      case 2: return 1.0;
      case 3: return 1.5;
      default: return 0.5;
    }
  };

  // Replace the loading check with this enhanced version
  if (auth.loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <SpinnerCircular
            size={50}
            color="#3B82F6"
            secondaryColor="#E5E7EB"
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Profile
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch your information...
          </p>
        </div>
      </div>
    );
  }

  // Add error handling right after the loading check
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-gray-500 mb-4">
            {error || 'An error occurred while loading your profile.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Update the main return statement layout:
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with minimal padding */}
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} className="px-4 py-2" />

      <div className="container mx-auto px-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 mb-4 flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture & Loyalty Card */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="relative w-40 h-40 mx-auto">
                <img
                  src={imagePreview || user?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full rounded-full cursor-pointer border-4 border-blue-500 mb-4 object-cover"
                  onClick={() => handleImageClick(user.profilePicture || '/default-avatar.png')}
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl text-white shadow-xl p-6">
              {/* Level Status */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Loyalty Status</h2>
                  <p className="text-3xl font-extrabold mb-1">
                    Level {level.level}
                    <span className="text-yellow-300 ml-2">
                      {level.level === 1 ? "Bronze" : level.level === 2 ? "Silver" : "Gold"} Wanderer
                    </span>
                  </p>
                  <p className="text-lg opacity-90">
                    Points Multiplier: <span className="text-yellow-300 font-bold">{getPointsMultiplier(level.level)}x</span>
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    {level.level === 1 ? (
                      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                    ) : level.level === 2 ? (
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    ) : (
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-white/20 rounded-full h-4 relative">
                  <div
                    className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${level.progress}%` }}
                  >
                    {level.progress > 10 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold">
                        {Math.round(level.progress)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Points Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-75 mb-1">Current Points</p>
                  <p className="text-2xl font-bold">{currentLoyaltyPoints?.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-75 mb-1">Total Points</p>
                  <p className="text-2xl font-bold">
                    {totalLoyaltyPoints?.toLocaleString()}
                    {level.level < 3 && level.nextThreshold && (
                      <span className="text-sm opacity-75 block">
                        of {level.nextThreshold?.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center & Right Columns - Profile Information */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Profile Information</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2 2 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</div>}

              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Email"
                    value={user.email}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>}
                  />
                  <InfoItem
                    label="Mobile Number"
                    value={user.mobileNumber}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>}
                  />
                  <InfoItem
                    label="Nationality"
                    value={user.nationality}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>}
                  />
                  <InfoItem
                    label="Occupation"
                    value={user.occupation}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>}
                  />
                  <div className="md:col-span-2">
                    <InfoItem
                      label="Preferences"
                      value={user.preferences.map(pref => pref.name).join(', ')}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="mobileNumber">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        +20
                      </span>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={updatedUser.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="01XXXXXXXX"
                        maxLength="11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="nationality">
                      Nationality
                    </label>
                    <select
                      id="nationality"
                      name="nationality"
                      value={updatedUser.nationality}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select Nationality</option>
                      {ARAB_NATIONALITIES.map(nationality => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="occupation"
                          value="Student"
                          checked={updatedUser.occupation === 'Student'}
                          onChange={handleInputChange}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Student</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="occupation"
                          value="Job"
                          checked={updatedUser.occupation === 'Job'}
                          onChange={handleInputChange}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Job</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex justify-between">
                      <span>Preferences</span>
                      <span className="text-blue-600">{updatedUser.preferences.length} selected</span>
                    </label>

                    <div className="relative space-y-3">

                      {/* Selected Tags */}
                      <div className="flex flex-wrap gap-2 min-h-[50px] p-2 border border-gray-200 rounded-md">
                        {updatedUser.preferences.map((pref) => (
                          <span
                            key={pref._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {pref.name}
                            <button
                              type="button"
                              onClick={() => {
                                setUpdatedUser(prev => ({
                                  ...prev,
                                  preferences: prev.preferences.filter(p => p._id !== pref._id)
                                }));
                              }}
                              className="ml-2 hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Available Tags */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border border-gray-200 rounded-md">
                        {preferenceTags
                          .filter(tag => !updatedUser.preferences.find(p => p._id === tag._id))
                          .map((tag) => (
                            <button
                              key={tag._id}
                              type="button"
                              onClick={() => {
                                setUpdatedUser(prev => ({
                                  ...prev,
                                  preferences: [...prev.preferences, tag]
                                }));
                              }}
                              className="text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>{tag.name}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="profilePicture">Profile Picture:</label>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="deliveryAddresses">Delivery Addresses:</label>
                        <div>
                            {updatedUser.deliveryAddresses.map((address, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => {
                                            const newAddresses = [...updatedUser.deliveryAddresses];
                                            newAddresses[index] = e.target.value;
                                            setUpdatedUser((prev) => ({ ...prev, deliveryAddresses: newAddresses }));
                                        }}
                                        className="p-2 border rounded mr-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAddress(index)}
                                        className="py-1 px-2 bg-red-500 text-white rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    className="p-2 border rounded mr-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="py-1 px-2 bg-green-500 text-white rounded-md"
                                >
                                    Add Address
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            type="submit"
                            className="py-2 px-4 bg-green-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            type="button"
                            className="py-2 px-4 bg-gray-500 text-white rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Click to add or remove preferences</p>
                  </div>

                  <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      {isUpdatingProfile ? (
                        <SpinnerCircular size={20} color="#FFFFFF" />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Action Buttons Card - Now same width as loyalty box */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Change Password</span>
                </button>
                <button
                  onClick={handleRequestAccountDeletion}
                  disabled={isDeletingAccount}
                  className="py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isDeletingAccount ? (
                    <SpinnerCircular size={20} color="#FFFFFF" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Request Deletion</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keep existing modals */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-bold mb-1" htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1" htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1" htmlFor="confirmNewPassword">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="py-2 px-4 bg-green-500 text-white rounded-md flex items-center justify-center"
                >
                  {isChangingPassword ? (
                    <SpinnerCircular size={20} color="#FFFFFF" />
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  type="button"
                  className="py-2 px-4 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img src={modalImageSrc} alt="Profile" className="max-w-full max-h-full" />
            <button
              onClick={() => setShowImageModal(false)}
              className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );

};
export default TouristProfile;