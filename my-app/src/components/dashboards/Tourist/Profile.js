import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from '../../Header.js';

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

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const fetchProfile = async () => {
        try {
          const response = await axiosInstance.get('/api/tourist/');
            console.log(response.data.profile);
          if (response.data.profile.totalLoyaltyPoints <= 100000) {
            setLevel(1);
          } else if (response.data.profile.totalLoyaltyPoints <= 500000) {
            setLevel(2);
          } else {
            setLevel(3);
          }
          


          const preferenceTagsResponse = await axiosInstance.get('/api/preferenceTag');
          const preferenceTags = preferenceTagsResponse.data;
          setUser(response.data.profile);
          setUpdatedUser(response.data.profile);
          setPreferenceTags(preferenceTags);
        } catch (err) {
          setError('Failed to load tourist profile.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
        setError('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    try {
      await axiosInstance.put('/api/tourist/changePassword', {
        oldPassword: currentPassword,
        newPassword,
      });
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert('Password changed successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to change password.');
      setError('Failed to change password.');
    }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      await axiosInstance.post('/api/accountDeletionRequest', {});
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('This Account already made an account deletion request.');
      } else {
        setError('Failed to request account deletion.');
      }
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

  // Update the profile picture input handler
  const handleProfilePictureChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setUpdatedUser((prev) => ({
          ...prev,
          profilePicture: base64,
        }));
      }
    } catch (error) {
      console.error("Error converting image:", error);
      setError('Failed to process image');
    }
  };

  if (auth.loading || !user) {
    return <div>Loading user data...</div>;
  }

return (
    <div className="min-h-screen bg-gray-100">
        <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
        <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
        >
            ← Back
        </button>

        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h1 className="text-2xl font-semibold mb-6">Profile Information</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {!isEditing ? (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <p className="font-bold">Username:</p>
                        <p>{user.username}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Email:</p>
                        <p>{user.email}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Mobile Number:</p>
                        <p>{user.mobileNumber}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Nationality:</p>
                        <p>{user.nationality}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Date of Birth:</p>
                        <p>{new Date(user.dob).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Occupation:</p>
                        <p>{user.occupation}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Preferences:</p>
                        <div>
                            {(user.preferences?.length > 0) ? (
                                user.preferences.map((preference) => (
                                    <p key={preference._id}>{preference.name}</p>
                                ))
                            ) : ("None")}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold">Profile Picture:</p>
                        <img
                            src={user.profilePicture || '/path/to/default/image.jpg'}
                            alt="Profile"
                            className="w-16 h-16 rounded-full cursor-pointer"
                            onClick={() => handleImageClick(user.profilePicture || '/path/to/default/image.jpg')}
                        />
                    </div>
                    <p className="text-center text-gray-700">You are a level {level} wanderer!</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="py-2 px-4 bg-blue-500 text-white rounded-md"
                        >
                            Update Account
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="py-2 px-4 bg-blue-500 text-white rounded-md"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleRequestAccountDeletion}
                            className="py-2 px-4 bg-red-500 text-white rounded-md"
                        >
                            Request Account Deletion
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="mobileNumber">Mobile Number:</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={updatedUser.mobileNumber}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="nationality">Nationality:</label>
                        <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            value={updatedUser.nationality}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="dob">Occupation:</label>
                        <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={updatedUser.occupation}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="font-bold" htmlFor="preferences">Preferences:</label>
                        <div className="grid grid-cols-2 gap-4">
                            {preferenceTags.map((tag) => (
                                <div key={tag._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={tag._id}
                                        name="preferences"
                                        value={tag._id}
                                        checked={updatedUser.preferences.some((preference) => preference._id === tag._id)}
                                        onChange={() => handleCheckboxChange(tag._id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={tag._id} className="text-sm">{tag.name}</label>
                                </div>
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
                </form>
            )}
        </div>

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
                                className="py-2 px-4 bg-green-500 text-white rounded-md"
                            >
                                Save
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
    </div>
);
};

export default TouristProfile;