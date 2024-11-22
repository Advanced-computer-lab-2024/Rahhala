import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';

const TouristProfile = () => {
  const [user, setUser ] = useState({
    id: 1,
    username: 'user123',
    email: 'user@example.com',
    mobileNumber: '+1234567890',
    profilePicture: '',
    workExperience: [
      { jobTitle: 'Software Engineer', company: 'Company A', yearsWorked: 3, description: 'Developed web applications.' },
      { jobTitle: 'Junior Developer', company: 'Company B', yearsWorked: 2, description: 'Assisted in frontend development.' },
    ],
    workId: 'SE123',
    certificationImages: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser , setUpdatedUser ] = useState({ ...user });
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const [newExperience, setNewExperience] = useState({
    jobTitle: '',
    company: '',
    yearsWorked: '',
    description: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const navigate = useNavigate();


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser ((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUpdatedUser ((prev) => ({
      ...prev,
      [name]: files.length > 0 ? URL.createObjectURL(files[0]) : prev[name],
    }));
  };

  const handleCertificationChange = (e) => {
    const { files } = e.target;
    setUpdatedUser ((prev) => ({
      ...prev,
      certificationImages: [...prev.certificationImages, ...Array.from(files)],
    }));
  };

  const handleAddExperience = () => {
    setUpdatedUser ((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }));
    setNewExperience({ jobTitle: '', company: '', yearsWorked: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser (updatedUser );
    setIsEditing(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword === passwordData.confirmNewPassword) {
      alert('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      alert('New passwords do not match');
    }
  };

  const handleRequestAccountDeletion = () => {
    alert('Request Account Deletion button clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
      <h1 className="text-2xl font-bold">Welcome, Username</h1>
      <div className="flex items-center ml-auto space-x-4 relative">
        <button onClick={toggleDropdown} className="p-2">
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
            <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide')}>Home</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide-profile')}>Profile</li>
              <li className="px-4 py-2 hover:bg-red-200 cursor-pointer text-red-600" onClick={() => (window.location.href = '/login')}>Sign Out</li>
            </ul>
          </div>
        )}
      </div>
    </header>
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 mt-4 ml-4 flex items-center"
      >
        ← Back
      </button>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-semibold mb-6">Profile Information</h1>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-bold">Username:</p>
              <p>{user.username}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">ID:</p>
              <p>{user.id}</p>
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
              <p className="font-bold">Work Experiences:</p>
              <div>
                {user.workExperience.map((exp, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>Title:</strong> {exp.jobTitle}</p>
                    <p><strong>Company:</strong> {exp.company}</p>
                    <p><strong>Years Worked:</strong> {exp.yearsWorked}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Profile Picture:</p>
              <img
                src={user.profilePicture || '/path/to/default/image.jpg'}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Certifications:</p>
              <div className="flex space-x-2">
                {user.certificationImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Certification ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ))}
              </div>
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
            <button
              onClick={() => setIsChangingPassword(true)}
              className="py-2 px-4 bg-white text-blue-500 border-2 border-blue-500 rounded-md"
            >
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedUser .email}
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
                value={updatedUser .mobileNumber}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>

            <div className="flex justify-between">
              <label className="font-bold" htmlFor="workExperience">Add Work Experience:</label>
              <div className="space-y-2">
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={newExperience.jobTitle}
                  onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                  placeholder="Job Title"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  placeholder="Company Name"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  id="yearsWorked"
                  name="yearsWorked"
                  value={newExperience.yearsWorked}
                  onChange={(e) => setNewExperience({ ...newExperience, yearsWorked: e.target.value })}
                  placeholder="Years Worked"
                  className="p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="py-2 px-4 bg-green-500 text-white rounded-md"
                >
                  Add Experience
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <label className="font-bold" htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="p-2"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-bold" htmlFor="certifications">Certifications:</label>
              <input
                type="file"
                id="certifications"
                name="certifications"
                accept="image/*"
                multiple
                onChange={handleCertificationChange}
                className="p-2"
              />
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
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

        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="oldPassword">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold" htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
              >
                Change Password
              </button>
              <button
                onClick={() => setIsChangingPassword(false)}
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