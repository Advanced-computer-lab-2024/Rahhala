import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from '../../Header.js';

const TouristProfile = () => {
    const { auth } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const [user, setUser ] = useState({
        id: 1,
        username: '',
        email: '',
        mobileNumber: '',
        profilePicture: '',
        previousWork: [
        { work: '', yearsOfExperience: 0},
        { work: '', yearsOfExperience: 0},
        ],
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get(`/api/tourGuide`);
                setUser(res.data.profile);
                setUpdatedUser(res.data.profile)
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, [auth]);

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

    const handleCertificationsChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedUser((prevState) => ({
                    ...prevState,
                    certificationImages: [...prevState.certificationImages, reader.result.split(',')[1]] // Assuming you want to store the base64 string without the prefix
                }));
            };
            reader.readAsDataURL(file);
            return reader;
        });
    };
    
    const handleAddExperience = () => {
        setUpdatedUser({...updatedUser, previousWork: [...updatedUser.previousWork, {work: '', yearsOfExperience: ''}]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(updatedUser)
        try{
            await axiosInstance.put('/api/tourGuide/edit', updatedUser);
            alert('Profile updated successfully');
            window.location.reload()
        } catch (err) {
            console.log(err);
            alert('Profile update failed');
        }
        // setUser (updatedUser );
        // setIsEditing(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword === passwordData.confirmNewPassword) {
            try{
                await axiosInstance.put("/api/tourGuide/edit/changePassword",{oldPassword:passwordData.oldPassword,newPassword:passwordData.newPassword})
                alert('Password changed successfully');
                setIsChangingPassword(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });

            } catch (err) {
                console.log(err);
                alert(err.response?.data?.message || 'Failed to change password');
            }
        } else {
            alert('New passwords do not match');
        }
    };

    const handleRequestAccountDeletion = async () => {
        try{
            await axiosInstance.post('/api/accountDeletionRequest');
            alert("Account deletion request submitted successfully");
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.error || 'Failed to change password');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    }

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
                <p>{user._id}</p>
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
                    {user.previousWork.map((exp, index) => (
                    <div key={index} className="mb-2">
                        <p><strong>Company:</strong> {exp.work}</p>
                        <p><strong>Years Worked:</strong> {exp.yearsOfExperience}</p>
                    </div>
                    ))}
                </div>
                </div>
                <div className="flex justify-between">
                <p className="font-bold">Profile Picture:</p>
                <img
                    src={user.profilePhoto ? `data:image/jpeg;base64,${user.profilePhoto}` : '/path/to/default/image.jpg'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${user.profilePhoto}`);
                        setIsModalOpen(true);
                }}
                />
                </div>
                <div className="flex justify-between">
                <p className="font-bold">Certifications:</p>
                <div className="flex space-x-2">
                    {user.certificationImages.map((img, index) => (
                    <img
                        key={index}
                        src={img ? `data:image/jpeg;base64,${img}` : '/path/to/default/image.jpg'}
                        alt={`Certification ${index + 1}`}
                        className="w-12 h-12 object-cover rounded-md"
                        onClick = {() => {  
                            setSelectedImage(`data:image/jpeg;base64,${user.certificationImages[index]}`);
                            setIsModalOpen(true);
                        }}
    
                    />
                    ))}
                </div>
                </div>
                <button
                onClick={() => {setIsEditing(true)
                    setUpdatedUser({...updatedUser, certificationImages:[]})
                }}
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
                    value={updatedUser .mobileNumber}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                    required
                />
                </div>

                <div className="flex justify-between">
                <label className="font-bold" htmlFor="workExperience">Add Work Experience:</label>
                {updatedUser.previousWork.map((newExperience, index) => (
                <div className="space-y-2">
                    <input
                    type="text"
                    id="company"
                    name="company"
                    value={updatedUser.previousWork[index].work || ''}
                    onChange={(e) => {
                        const updatedWork = [...updatedUser.previousWork];
                        updatedWork[index].work = e.target.value;
                        setUpdatedUser({ ...updatedUser, previousWork: updatedWork });
                    }}
                    placeholder="Company Name"
                    className="p-2 border rounded"
                    required
                    />
                    <input
                    type="number"
                    id="yearsWorked"
                    name="yearsWorked"
                    value={updatedUser.previousWork[index].yearsOfExperience || ''}
                    onChange={(e) => {
                        const updatedWork = [...updatedUser.previousWork];
                        updatedWork[index].yearsOfExperience = e.target.value;
                        setUpdatedUser({ ...updatedUser, previousWork: updatedWork });
                    }}

                    placeholder="Years Worked"
                    className="p-2 border rounded"
                    required
                    />
                </div>
                ))}
                    <button
                    type="button"
                    onClick={handleAddExperience}
                    className="py-2 px-4 bg-green-500 text-white rounded-md"
                    >
                    Add Experience
                    </button>


                </div>

                <div className="flex justify-between">
                <label className="font-bold" htmlFor="profilePicture">Profile Picture:</label>
                <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
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
                    onChange = {handleCertificationsChange}
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
                    onClick={() => 
                        {setIsEditing(false)
                        setUpdatedUser(user)
                        }}
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
                    onClick={() => {setIsChangingPassword(false)
                    setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                    }}
                    type="button"
                    className="py-2 px-4 bg-gray-500 text-white rounded-md"
                >
                    Cancel
                </button>
                </div>
            </form>
            )}
             {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default TouristProfile;