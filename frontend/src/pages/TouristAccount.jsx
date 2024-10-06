import React from 'react'
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig'; // Axios instance for API calls
import axios from 'axios';
import { useContext } from 'react';
import { get } from 'mongoose';

const TouristAccount = () => {
    const getTourist = async() => {
        try {
            const response = await axiosInstance.get('/touristAccount/${auth.user.id}');
            console.log(response);
        } catch (error) {
            console.error('Error fetching tourist profile:', error);
        }
    }
    getTourist();
    const { auth } = useContext(AuthContext);
    console.log(auth);
    const response = axiosInstance.get('/touristAccount/${auth.user.id}');
    console.log(response);
  return (
    <div>TouristAccount</div>
  )
}

export default TouristAccount