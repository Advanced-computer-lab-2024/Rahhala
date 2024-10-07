import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const AdvertiserDashboard = () => {
  return (
    <div>
        <NavigateButton path={"/advertiserAccount"} text={"View Account"}/>{'\u00A0'}
    </div>
  )
}

export default AdvertiserDashboard