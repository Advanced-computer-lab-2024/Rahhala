import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
const TouristProfile = () => {
  const [user, setUser] = useState({
    id: 1,
    email: "user@example.com",
    username: "user123",
    mobileNumber: "+1234567890",
    nationality: "American",
    dateOfBirth: "1990-01-01",
    occupation: "Software Engineer",
    wallet: 250.00,
    preferences: "Dark Mode, English",
    currency: "USD",
    totalLoyaltyPoints: 1000,
    currentLoyaltyPoints: 150,
    profilePicture: "", // Empty string for now, can be updated with an image URL
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(updatedUser); // Update user with the new values
    setIsEditing(false);   // Close the form
  };

  const handleChangePassword = () => {
    alert('Change Password button clicked');
    // Add logic to handle password change
  };

  const handleRequestAccountDeletion = () => {
    alert('Request Account Deletion button clicked');
    // Add logic for account deletion request
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

        {/* Profile Display */}
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-bold">User ID:</p>
              <p>{user.id}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Username:</p>
              <p>{user.username}</p>
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
              <p>{user.dateOfBirth}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Occupation:</p>
              <p>{user.occupation}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Wallet Balance:</p>
              <p>{user.currency} {user.wallet.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Preferences:</p>
              <p>{user.preferences}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Currency:</p>
              <p>{user.currency}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Total Loyalty Points:</p>
              <p>{user.totalLoyaltyPoints}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Current Loyalty Points:</p>
              <p>{user.currentLoyaltyPoints}</p>
            </div>
            {/* Update Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Update Account
            </button>

            {/* Request Account Deletion Button */}
            <button
              onClick={handleRequestAccountDeletion}
              className="mt-4 ml-4 py-2 px-4 bg-red-500 text-white rounded-md"
            >
              Request Account Deletion
            </button>
          </div>
        ) : (
          // Update Form
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
              <label className="font-bold" htmlFor="occupation">Occupation:</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={updatedUser.occupation}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
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
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="currency">Currency:</label>
              <input
                type="text"
                id="currency"
                name="currency"
                value={updatedUser.currency}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="preferences">Preferences:</label>
              <input
                type="text"
                id="preferences"
                name="preferences"
                value={updatedUser.preferences}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
            </div>

            {/* Change Password Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleChangePassword}
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
              >
                Change Password
              </button>
            </div>

            {/* Save and Cancel Buttons */}
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
