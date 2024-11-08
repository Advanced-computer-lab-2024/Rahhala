import React from 'react';

const TouristForm = ({ formData, handleChange }) => (
    <>
        <div>
            <label>Mobile Number:</label>
            <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>Nationality:</label>
            <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>Date of Birth:</label>
            <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label>Occupation:</label>
            <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                <option value="job">Job</option>
                <option value="student">Student</option>
            </select>
        </div>
    </>
);

export default TouristForm;