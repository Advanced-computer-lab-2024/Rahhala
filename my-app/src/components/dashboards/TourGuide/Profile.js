import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';

const TouristGuideProfile = () => {
    const { auth } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const Toast = ({ message, type }) => (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className={`rounded-lg px-4 py-3 shadow-lg ${
                type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
                <div className="flex items-center space-x-3">
                    {type === 'success' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <p className="font-medium">{message}</p>
                </div>
            </div>
        </div>
    );

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
                setIsPasswordModalOpen(false);
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
            <header className="text-white flex justify-between items-center p-4 w-full" style={{ backgroundColor: '#334EAC' }}>
                <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
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

            <div className="container mx-auto px-4 mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 mb-4 flex items-center"
                >
                    ← Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Picture & Basic Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="relative w-40 h-40 mx-auto">
                                <img
                                    src={user.profilePhoto ? `data:image/jpeg;base64,${user.profilePhoto}` : '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-full h-full rounded-full cursor-pointer border-4 border-blue-500 mb-4 object-cover"
                                    onClick={() => {
                                        setSelectedImage(`data:image/jpeg;base64,${user.profilePhoto}`);
                                        setIsModalOpen(true);
                                    }}
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="profilePicture"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Guide Information</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

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
                        </div>

                        {/* Action Buttons Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Change Password</span>
                                </button>
                                <button 
                                    onClick={handleRequestAccountDeletion}
                                    className="py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isPasswordModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold" htmlFor="oldPassword">Old Password:</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder='Old Password'
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
                                    placeholder='New Password'
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-between gap-6">
                                <label className="font-bold" htmlFor="confirmNewPassword">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    placeholder='Confirm New Password'
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
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                                    }}
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
            {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
};

export default TouristGuideProfile;