import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';
import Logout from '../components/Auth/Logout';

const SellerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const fetchSeller = async () => {
        try {
          const response = await axiosInstance.get('api/seller/');
          setProfile(response.data.profile);
        } catch (err) {
          setError('Error fetching seller profile');
        }
      };
      fetchSeller();
    } else {
      navigate('/login');
    }
  }, [auth, navigate]);

  const handleAcceptTerms = async () => {
    try {
      const response = await axiosInstance.put('api/seller/acceptTerms', {
        acceptedTermsAndConditions: true
      });
      setProfile({
        ...profile,
        acceptedTermsAndConditions: true
      });
      setError('Terms and conditions accepted successfully');
    } catch (err) {
      setError('Error accepting terms and conditions');
    }
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      {error && <p>{error}</p>}
      {profile && !profile.acceptedTermsAndConditions && (
        <div>
          <p>You still haven't accepted terms and conditions. You can't continue to use the system. <button onClick={handleAcceptTerms}>Click here to accept</button></p>
        </div>
      )}
      {profile && profile.acceptedTermsAndConditions && (
        <>
          <NavigateButton path='/sellerAccount' text='View Account'/>{'\u00A0'} 
          <NavigateButton path='/createProduct' text='Create New Product'/>{'\u00A0'} 
          
          <br/><br/>
        </>
      )}
      <Logout />
    </div>
  );
};

export default SellerDashboard;