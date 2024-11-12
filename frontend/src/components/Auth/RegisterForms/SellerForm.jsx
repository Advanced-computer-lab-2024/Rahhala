import React from 'react';

const SellerForm = ({ formData, handleChange, handleFileChange }) => {
    return (
        <div>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
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

export default SellerForm;