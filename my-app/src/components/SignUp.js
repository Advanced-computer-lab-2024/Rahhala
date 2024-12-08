import React, { useState, useContext } from 'react';
import signupImage from '../images/pexels-wanderer-731217.jpg';
import backgroundImage from '../images/pexels-codioful-7130504.jpg';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import TouristForm from './dashboards/RegisterForms/TouristForm';
import TourGuideForm from './dashboards/RegisterForms/TourGuideForm';
import SellerForm from './dashboards/RegisterForms/SellerForm';
import AdvertiserForm from './dashboards/RegisterForms/AdvertiserForm';

function Signup() {
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
    certificationImage:'',
    profilePhoto: '', // New field
    companyProfile: '', // New field
    // Advertiser and seller Fields
    taxationRegistryImage: '',
    logo: '',
    // New fields
    profilePhoto: '', // New field
  });

  const [message, setMessage] = useState('');

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
      certificationImages: '', // New field
      idCardImage: '', // New field
      name: '',
      description: '',
      websiteLink: '',
      hotline: '',
      companyProfile: '',
      profilePhoto: '', // New field
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Remove the prefix
      setFormData({
        ...formData,
        [name]: base64String
      });
    };
    reader.readAsDataURL(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages
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
          profilePhoto: formData.profilePhoto, // New field
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
      if (['tourguide', 'seller', 'advertiser'].includes(userType)) {
        setMessage('Registration successful! Please wait for admin approval then login.');
        await sleep(3000); // Wait for 3 seconds
        navigate('/login');
      } else {
        setMessage('Registration successful!');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setMessage(error.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div
      className="h-screen overflow-y-auto bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="relative h-screen flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-black/50"
          style={{
            backdropFilter: 'blur(10px)',
            zIndex: -1,
          }}
        ></div>

        <div className="relative z-10">
          <h1 
            className="text-5xl font-bold text-white"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}
          >
            Welcome to Rahhala
          </h1>
          <p 
            className="text-xl text-white mt-4"
            style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}
          >
            Scroll down to sign up
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg opacity-90">
          
          <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
            <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>
            {message && <p className="text-center text-red-500">{message}</p>}
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
              {userType === 'tourist' && <TouristForm formData={formData} handleChange={handleChange} />}
              {userType === 'tourguide' && (
                <TourGuideForm
                  formData={formData}
                  handleChange={handleChange}
                  handlePreviousWorkChange={handlePreviousWorkChange}
                  addPreviousWork={addPreviousWork}
                  removePreviousWork={removePreviousWork}
                  handleFileChange={handleFileChange}
                />
              )}
              {userType === 'seller' && <SellerForm formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} />}
              {userType === 'advertiser' && <AdvertiserForm formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} />}
              <select 
                name="userType"
                value={userType}
                onChange={handleUserTypeChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="tourist">Tourist</option>
                <option value="tourguide">Tour Guide</option>
                <option value="seller">Seller</option>
                <option value="advertiser">Advertiser</option>
              </select>
              <button 
                type="submit" 
                className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account? <a href="/login" className="text-blue-500">Login</a>
            </p>
          </div>

          <div className="hidden md:flex w-1/2">
            <img 
              src={signupImage} 
              alt="Signup" 
              className="object-cover w-full h-full rounded-r-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
