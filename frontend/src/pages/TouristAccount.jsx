import React from 'react'
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig'; // Axios instance for API calls
import axios from 'axios';
import { useContext } from 'react';

const TouristAccount = () => {
    const { auth } = useContext(AuthContext);
    console.log(auth);
    const response = axiosInstance.get('/touristAccount/${auth.user.id}');
    console.log(response);
  return (
    <div>TouristAccount</div>
  )
}

export default TouristAccount