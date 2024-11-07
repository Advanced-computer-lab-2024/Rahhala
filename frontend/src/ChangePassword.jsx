import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ userRole }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation: Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(`/api/${userRole}/change-password`, {
        currentPassword,
        newPassword,
      });

      setMessage(response.data.message || 'Password updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to change password. Try again.');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
