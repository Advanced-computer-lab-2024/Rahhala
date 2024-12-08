import React from 'react';

const TouristForm = ({ formData, handleChange }) => (
    <>
        <div>
            <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />
        </div>
        <div>
            <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Nationality"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />
        </div>
        <div>
            <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />
        </div>
        <div>
            <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            >
                <option value="job">Job</option>
                <option value="student">Student</option>
            </select>
        </div>
    </>
);

export default TouristForm;