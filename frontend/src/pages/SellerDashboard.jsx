import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';
import Logout from '../components/Auth/Logout';

const SellerDashboard = () => {
  return (
    <div>
        <NavigateButton path='/sellerAccount' text='View Account'/>{'\u00A0'} 
        <NavigateButton path='/createProduct' text='Create New Product'/>{'\u00A0'} 
        <br/><br/>
        <Logout />
    </div>
  )
}

export default SellerDashboard