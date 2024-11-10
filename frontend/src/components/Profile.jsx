import React from 'react';

const Profile = ({ data }) => {
    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((item, index) => (
                        <li key={index}>{renderValue(item)}</li>
                    ))}
                </ul>
            );
        } else if (typeof value === 'object' && value !== null) {
            return (
                <ul>
                    {Object.entries(value).map(([key, val]) => (
                        <li key={key}><strong>{key}:</strong> {renderValue(val)}</li>
                    ))}
                </ul>
            );
        }
        return value;
    };

    return (
        <div>
            {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                    <strong>{key}:</strong> {renderValue(value)}
                </div>
            ))}
        </div>
    );
};

export default Profile;