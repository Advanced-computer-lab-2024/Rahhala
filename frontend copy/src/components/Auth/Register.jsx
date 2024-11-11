import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import TouristForm from './RegisterForms/TouristForm';
import TourGuideForm from './RegisterForms/TourGuideForm';
import SellerForm from './RegisterForms/SellerForm';
import AdvertiserForm from './RegisterForms/AdvertiserForm';
import { jwtDecode } from 'jwt-decode';



const Register = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [userType, setUserType] = useState('tourist'); // Default userType
    const [formData, setFormData] = useState({
        userType: 'tourist',
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
        previousWork: [{ yearsOfExperience: '', work: '' }], // Updated field
        certificationImages: [], // New field
        // Seller Fields
        name: '',
        description: '',
        // Advertiser Fields
        websiteLink: '',
        hotline: '',
        companyProfile: '',
        // Advertiser and TourGuide Fields
        idCardImage: '', // New field
        // Advertiser and seller Fields
        taxationRegistryImage: '',
        logo: '',
 
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
            previousWork: [{ yearsOfExperience: '', work: '' }], // Updated field
            certificationImages: [], // New field
            idCardImage: '', // New field
            name: '',
            description: '',
            websiteLink: '',
            hotline: '',
            companyProfile: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePreviousWorkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPreviousWork = formData.previousWork.map((work, i) => 
            i === index ? { ...work, [name]: value } : work
        );
        setFormData({
            ...formData,
            previousWork: updatedPreviousWork
        });
    };

    const addPreviousWork = () => {
        setFormData({
            ...formData,
            previousWork: [...formData.previousWork, { yearsOfExperience: '', work: '' }]
        });
    };

    const removePreviousWork = (index) => {
        const updatedPreviousWork = formData.previousWork.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            previousWork: updatedPreviousWork
        });
    };

    const navigateBasedOnUserType = () => {
        if (userType === 'tourguide') {
            navigate('/tourguide-dashboard');
        } 
        else if (userType === 'seller') {
            navigate('/seller-dashboard');
        }
        else if (userType === 'advertiser') {
            navigate('/advertiser-dashboard');
        }
        else if(userType === 'tourist'){
            navigate('/touristAccount');
        }
        else {
            navigate('/'); // Default path if userType is not recognized
        }
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear any previous messages
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
                    previousWork: formData.previousWork, // Updated field
                    certificationImages: formData.certificationImages, // New field
                    idCardImage: formData.idCardImage, // New field
                };
                break;
            case 'seller':
                dataToSend = {
                    ...dataToSend,
                    name: formData.name,
                    description: formData.description,
                    idCardImage: formData.idCardImage,
                    taxationRegistryImage: formData.taxationRegistryImage,
                    logo: formData.logo,
                };
                break;
            case 'advertiser':
                dataToSend = {
                    ...dataToSend,
                    websiteLink: formData.websiteLink,
                    hotline: formData.hotline,
                    companyProfile: formData.companyProfile,
                    idCardImage: formData.idCardImage,
                    taxationRegistryImage: formData.taxationRegistryImage,
                    logo: formData.logo,
                };
                break;
            default:
                break;
        }

        try {
            console.log('Submitting registration data:', dataToSend);
            const response = await axiosInstance.post('api/auth/register', dataToSend);
            console.log('Received response:', response.data);
            // Set appropriate success message and conditional redirection
            if (['tourguide', 'seller', 'advertiser'].includes(userType)) {
                setMessage('Registration successful! Please wait for admin approval then login.');
                await sleep(3000); // Wait for 3 seconds
                navigate('/login');
            } else {
                setMessage('Registration successful!');
                // store the token and redirect
                const { token } = response.data;
                const decoded = jwtDecode(token);
                console.log("decoded is ",decoded);
    
                setAuth({
                    token,
                    isAuthenticated: true,
                    loading: false,
                    user: {
                        id: decoded.id,
                        type: decoded.userType,
                    },
                });
    
                localStorage.setItem('token', token);
    
                navigateBasedOnUserType();
            }
    
            } catch (error) {
                console.error('Registration failed:', error);
                setMessage(error.response?.data?.message || 'Registration failed.');
            }
    };

    return (
        <div>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User Type:</label>
                    <select name="userType" value={userType} onChange={handleUserTypeChange}>
                        <option value="tourist">Tourist</option>
                        <option value="tourguide">Tour Guide</option>
                        <option value="seller">Seller</option>
                        <option value="advertiser">Advertiser</option>
                    </select>
                </div>
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
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
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
                {userType === 'tourist' && <TouristForm formData={formData} handleChange={handleChange} />}
                {userType === 'tourguide' && (
                    <TourGuideForm
                        formData={formData}
                        handleChange={handleChange}
                        handlePreviousWorkChange={handlePreviousWorkChange}
                        addPreviousWork={addPreviousWork}
                        removePreviousWork={removePreviousWork}
                    />
                )}
                {userType === 'seller' && <SellerForm formData={formData} handleChange={handleChange} />}
                {userType === 'advertiser' && <AdvertiserForm formData={formData} handleChange={handleChange} />}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;