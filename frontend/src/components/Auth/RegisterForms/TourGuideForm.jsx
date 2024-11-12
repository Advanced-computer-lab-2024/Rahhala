import React from 'react';

const TourGuideForm = ({ formData, handleChange, handlePreviousWorkChange, addPreviousWork, removePreviousWork, handleFileChange }) => {
    return (
        <div>
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
                <label>Years of Experience:</label>
                <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Previous Work:</label>
                {formData.previousWork.map((work, index) => (
                    <div key={index}>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={work.yearsOfExperience}
                            onChange={(e) => handlePreviousWorkChange(index, e)}
                            placeholder="Years of Experience"
                            required
                        />
                        <input
                            type="text"
                            name="work"
                            value={work.work}
                            onChange={(e) => handlePreviousWorkChange(index, e)}
                            placeholder="Work Description"
                            required
                        />
                        <button type="button" onClick={() => removePreviousWork(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addPreviousWork}>Add Previous Work</button>
            </div>
            <div>
                <label>Certification Images:</label>
                <input
                    type="file"
                    name="certificationImages"
                    onChange={handleFileChange}
                    multiple
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
                <label>Profile Photo:</label>
                <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default TourGuideForm;