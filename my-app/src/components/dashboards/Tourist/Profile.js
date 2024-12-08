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
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const fetchProfile = async () => {
        try {
          const response = await axiosInstance.get('/api/tourist/');
          delete response.data.profile.password;
          delete response.data.profile.createdAt;
          delete response.data.profile.__v;
          delete response.data.profile.updatedAt;
          delete response.data.profile.bookedActivities;
          delete response.data.profile.bookedItineraries;
          delete response.data.profile.bookedMuseums;
          delete response.data.profile.complaints;
          delete response.data.profile.purchasedProducts;

          if (response.data.profile.totalLoyaltyPoints <= 100000) {
            setLevel(1);
          } else if (response.data.profile.totalLoyaltyPoints <= 500000) {
            setLevel(2);
          } else {
            setLevel(3);
          }
          

          const preferenceTagsResponse = await axiosInstance.get('/api/preferenceTag');
          const preferenceTags = preferenceTagsResponse.data;
          response.data.profile.preferences = response.data.profile.preferences.map((preferenceId) => {
            const tag = preferenceTags.find((tag) => tag._id === preferenceId);
            return tag ? tag.name : preferenceId;
          }).join(', ');

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
      const preferencesArray = prev.preferences.split(', ').filter(Boolean);
      const newPreferences = preferencesArray.includes(tagId)
        ? preferencesArray.filter((id) => id !== tagId)
        : [...preferencesArray, tagId];
      return { ...prev, preferences: newPreferences.join(', ') };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const preferencesIds = updatedUser.preferences.split(', ').map((name) => {
        const tag = preferenceTags.find((tag) => tag.name === name);
        return tag ? tag._id : name;
      });

      const updatedUserWithIds = { ...updatedUser, preferences: preferencesIds.join(', ') };

      await axiosInstance.put(`/api/tourist/edit/${auth.user._id}`, updatedUserWithIds);
      const response = await axiosInstance.get('/api/tourist/');
      delete response.data.profile.password;
      delete response.data.profile.createdAt;
      delete response.data.profile.__v;
      delete response.data.profile.updatedAt;
      delete response.data.profile.bookedActivities;
      delete response.data.profile.bookedItineraries;
      delete response.data.profile.bookedMuseums;
      delete response.data.profile.complaints;
      delete response.data.profile.purchasedProducts;

      const preferenceTagsResponse = await axiosInstance.get('/api/preferenceTag');
      const preferenceTags = preferenceTagsResponse.data;
      response.data.profile.preferences = response.data.profile.preferences.map((preferenceId) => {
        const tag = preferenceTags.find((tag) => tag._id === preferenceId);
        return tag ? tag.name : preferenceId;
      }).join(', ');

      setUser(response.data.profile);
      setUpdatedUser(response.data.profile);
      setIsEditing(false);
    } catch (err) {
        console.log(err)
      setError('Failed to update profile.');
    }
  };

  const handleChangePassword = () => {
    navigate('/touristChangePassword');
  };

  const handleRequestAccountDeletion = async () => {
    try {
        const response = await axiosInstance.post('/api/accountDeletionRequest', {});
    } catch (err) {
        if (err.response && err.response.status === 409) {
            setError('This Account already made an account deletion request.');
        } else {
            setError('Failed to request account deletion.');
        }
    }  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
{Object.keys(user).map((key) => (
  <div className="flex justify-between" key={key}>
    <p className="font-bold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</p>
    <p>
      {Array.isArray(user[key])
        ? user[key].map((item, index) => (
            <div key={index}>
              {typeof item === 'object' && item !== null
                ? Object.keys(item).map((subKey) => (
                    <div key={subKey}>
                      <span className="font-bold">{subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {item[subKey]}
                    </div>
                  ))
                : item}
            </div>
          ))
        : typeof user[key] === 'object' && user[key] !== null
        ? Object.keys(user[key]).map((subKey) => (
            <div key={subKey}>
              <span className="font-bold">{subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {user[key][subKey]}
            </div>
          ))
        : key === 'dob'
        ? new Date(user[key]).toLocaleDateString()
        : user[key]}
    </p>
  </div>
))}            <div className="mt-4">
            <p className="text-center text-gray-700">
                You are a level {level} wanderer!
            </p>
            </div>  
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Update Account
            </button>
            <button
              onClick={handleRequestAccountDeletion}
              className="mt-4 ml-4 py-2 px-4 bg-red-500 text-white rounded-md"
            >
              Request Account Deletion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(updatedUser).map((key) => (
              key !== 'id' && key !== 'username' && key !== 'dob' && key !== 'wallet' && key !== 'totalLoyaltyPoints' && key !== 'currentLoyaltyPoints' && key !== 'profilePicture' && (
                <div className="flex justify-between items-center" key={key}>
                  <label className="font-bold" htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </label>
                  {key === 'preferences' ? (
                    <div className="grid grid-cols-2 gap-4">
                      {preferenceTags.map((tag) => (
                        <div key={tag._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={tag._id}
                            name="preferences"
                            value={tag._id}
                            checked={updatedUser.preferences.split(', ').includes(tag._id)}
                            onChange={() => handleCheckboxChange(tag._id)}
                            className="mr-2"
                          />
                          <label htmlFor={tag._id} className="text-sm">{tag.name}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={updatedUser[key]}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                      required
                    />
                  )}
                </div>
              )
            ))}
            <div className="flex justify-between items-center">
              <label className="font-bold" htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUpdatedUser((prev) => ({
                      ...prev,
                      profilePicture: URL.createObjectURL(file),
                    }));
                  }
                }}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleChangePassword}
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
              >
                Change Password
              </button>
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
    </div>
  );
};

export default TouristProfile;