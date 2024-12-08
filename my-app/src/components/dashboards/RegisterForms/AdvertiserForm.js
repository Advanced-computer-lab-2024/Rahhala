import React from 'react';

const AdvertiserForm = ({ formData, handleChange, handleFileChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <input
                    type="text"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleChange}
                    placeholder='Website Link'
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <input
                    type="text"
                    name="hotline"
                    value={formData.hotline}
                    onChange={handleChange}
                    placeholder='Hotline'
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Company Profile:</label>
                <input
                    type="file"
                    name="companyProfile"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">ID Card Image:</label>
                <input
                    type="file"
                    name="idCardImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Taxation Registry Image:</label>
                <input
                    type="file"
                    name="taxationRegistryImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Logo:</label>
                <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
        </div>
    );
};

export default AdvertiserForm;