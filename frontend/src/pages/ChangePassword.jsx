import React, { useState } from 'react';

const ChangePassword = ({ userRole, handleChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleChangePassword(currentPassword, newPassword, confirmNewPassword);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Current Password:</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Confirm New Password:</label>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Change Password</button>
        </form>
    );
};

export default ChangePassword;