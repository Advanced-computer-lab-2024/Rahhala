import React from 'react';

const AdvertiserForm = ({ formData, handleChange, handleFileChange }) => {
    return (
        <div>
            <div>
                <label>Website Link:</label>
                <input
                    type="text"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Hotline:</label>
                <input
                    type="text"
                    name="hotline"
                    value={formData.hotline}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Company Profile:</label>
                <input
                    type="file"
                    name="companyProfile"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <div>
                <label>ID Card Image:</label>
                <input
                    type="file"
                    name="idCardImage"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <div>
                <label>Taxation Registry Image:</label>
                <input
                    type="file"
                    name="taxationRegistryImage"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <div>
                <label>Logo:</label>
                <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    required
                />
            </div>
        </div>
    );
};

export default AdvertiserForm;