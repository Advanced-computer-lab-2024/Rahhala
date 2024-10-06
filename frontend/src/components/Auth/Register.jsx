// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig'; // Adjust the path as necessary

const Register = () => {
    const [userType, setUserType] = useState('tourist'); // Default userType
    const [formData, setFormData] = useState({
        userType: '',
        username: '',
        password: '',
        email: '',
        // Tourist Fields
        mobileNumber: '',
        nationality: '',
        dob: '',
        occupation: 'job',
        // TourGuide Fields
        yearsOfExperience: '',
        previousWork: '',
        // Seller Fields
        name: '',
        description: '',
        // Advertiser Fields
        websiteLink: '',
        hotline: '',
        companyProfile: '',
    });

    const [message, setMessage] = useState('');

    // Handle change for userType selection
    const handleUserTypeChange = (e) => {
        const selectedUserType = e.target.value;
        setUserType(selectedUserType);
        setFormData({
            ...formData,
            userType: selectedUserType,
            // Reset fields not relevant to the selected userType
            mobileNumber: '',
            nationality: '',
            dob: '',
            occupation: 'job',
            yearsOfExperience: '',
            previousWork: '',
            name: '',
            description: '',
            websiteLink: '',
            hotline: '',
            companyProfile: '',
        });
    };

    // Handle change for all form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data to send based on userType
        let dataToSend = {
            userType: formData.userType,
            username: formData.username,
            password: formData.password,
            email: formData.email,
        };

        switch (userType) {
            case 'tourist':
                dataToSend = {
                    ...dataToSend,
                    mobileNumber: formData.mobileNumber,
                    nationality: formData.nationality,
                    dob: formData.dob,
                    occupation: formData.occupation,
                };
                break;
            case 'tourguide':
                dataToSend = {
                    ...dataToSend,
                    mobileNumber: formData.mobileNumber,
                    yearsOfExperience: formData.yearsOfExperience,
                    previousWork: formData.previousWork,
                };
                break;
            case 'seller':
                dataToSend = {
                    ...dataToSend,
                    name: formData.name,
                    description: formData.description,
                };
                break;
            case 'advertiser':
                dataToSend = {
                    ...dataToSend,
                    websiteLink: formData.websiteLink,
                    hotline: formData.hotline,
                    companyProfile: formData.companyProfile,
                };
                break;
            default:
                break;
        }

        try {
            const response = await axiosInstance.post('/register', dataToSend);
            setMessage('Registration successful!');

            // Optionally, store the token and redirect
            const { token } = response.data;
            localStorage.setItem('token', token);
            // Redirect to dashboard or login page
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div>
                    <label>User Type:</label>
                    <select name="userType" value={userType} onChange={handleUserTypeChange} required>
                        <option value="tourist">Tourist</option>
                        <option value="tourguide">Tour Guide</option>
                        <option value="seller">Seller</option>
                        <option value="advertiser">Advertiser</option>
                    </select>
                </div>

                {/* Common Fields */}
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Conditional Fields Based on User Type */}
                {userType === 'tourist' && (
                    <>
                        <div>
                            <label>Mobile Number:</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Nationality:</label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Occupation:</label>
                            <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                                <option value="job">Job</option>
                                <option value="student">Student</option>
                            </select>
                        </div>
                    </>
                )}

                {userType === 'tourguide' && (
                    <>
                        <div>
                            <label>Mobile Number:</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Years of Experience:</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label>Previous Work:</label>
                            <input
                                type="text"
                                name="previousWork"
                                value={formData.previousWork}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                {userType === 'seller' && (
                    <>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {userType === 'advertiser' && (
                    <>
                        <div>
                            <label>Website Link:</label>
                            <input
                                type="url"
                                name="websiteLink"
                                value={formData.websiteLink}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Hotline:</label>
                            <input
                                type="text"
                                name="hotline"
                                value={formData.hotline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Company Profile:</label>
                            <textarea
                                name="companyProfile"
                                value={formData.companyProfile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
