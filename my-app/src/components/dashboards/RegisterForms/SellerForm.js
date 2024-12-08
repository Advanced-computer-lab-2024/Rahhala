import React from 'react';

const SellerForm = ({ formData, handleChange, handleFileChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder='Name'
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Description'
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">ID Card Image:</label>
                <input
                    type="file"
                    name="idCardImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Taxation Registry Image:</label>
                <input
                    type="file"
                    name="taxationRegistryImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Logo:</label>
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

export default SellerForm;