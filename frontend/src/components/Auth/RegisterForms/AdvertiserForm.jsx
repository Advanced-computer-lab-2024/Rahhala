import React from 'react';

const AdvertiserForm = ({ formData, handleChange }) => (
    <>
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
                type="text"
                name="companyProfile"
                value={formData.companyProfile}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>Logo URL:</label>
            <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>ID Card Image URL:</label>
            <input
                type="text"
                name="idCardImage"
                value={formData.idCardImage}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>Taxation Registry Image URL:</label>
            <input
                type="text"
                name="taxationRegistryImage"
                value={formData.taxationRegistryImage}
                onChange={handleChange}
                required
            />
        </div>
    </>
);

export default AdvertiserForm;