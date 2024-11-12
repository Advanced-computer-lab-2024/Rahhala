import React from 'react';

const Profile = ({ data }) => {
    const isImageLink = (value) => {
        return value.startsWith('http') || value.startsWith('https') || value.startsWith('www');
    };

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
                key === 'companyProfile' || key === 'taxationRegistryImage' || key === 'idCardImage' || key === 'logo' || key==="profilePhoto" ? (
                    <div key={key}>
                        <strong>{key}:</strong>
                        {isImageLink(value) ? (
                            <img src={value} alt={`${key}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                        ) : (
                            <img src={`data:image/jpeg;base64,${value}`} alt={`${key}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                        )}
                    </div>
                ) : ( key==="certificationImages" ? (
                    <div key={key}>
                        <strong>{key}:</strong>
                        <ul>
                            {value.map((item, index) => (
                                <li key={index}>
                                    {isImageLink(item) ? (
                                        <img src={item} alt={`${key}-${index}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                                    ) : (
                                        <img src={`data:image/jpeg;base64,${item}`} alt={`${key}-${index}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                                    )}
                                </li>
                        ))}
                        </ul>
                    <div key={key}>
                    </div>

                    {/* <div key={key}>
                    <strong>{key}:</strong> {renderValue(value)} */}
                </div>
                ) : (
                    <p key={key}><strong>{key}:</strong> {renderValue(value)}</p>
                )
                )
            ))}
        </div>
    );
};

export default Profile;