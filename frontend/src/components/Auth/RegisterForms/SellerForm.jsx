import React from 'react';

const SellerForm = ({ formData, handleChange }) => (
    <>
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

export default SellerForm;