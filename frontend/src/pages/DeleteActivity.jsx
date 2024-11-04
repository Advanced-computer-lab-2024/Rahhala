import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const DeleteActivity = () => {
  const [activityId, setActivityId] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/deleteActivity/${activityId}`);
      alert('Activity deleted successfully');
      navigate('/advertiser-dashboard');
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  return (
    <div>
      <h1>Delete Activity</h1>
      <input
        type="text"
        placeholder="Enter Activity ID"
        value={activityId}
        onChange={(e) => setActivityId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Activity</button>
      <NavigateButton path="/advertiser-dashboard" text="Home"/>
    </div>
  );
};

export default DeleteActivity;