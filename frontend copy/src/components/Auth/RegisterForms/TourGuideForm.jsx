import React from 'react';

const TourGuideForm = ({ formData, handleChange, handlePreviousWorkChange, addPreviousWork, removePreviousWork }) => (
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
                        placeholder="Years of Experience"
                        value={work.yearsOfExperience}
                        onChange={(e) => handlePreviousWorkChange(index, e)}
                        required
                    />
                    <input
                        type="text"
                        name="work"
                        placeholder="Work"
                        value={work.work}
                        onChange={(e) => handlePreviousWorkChange(index, e)}
                        required
                    />
                    <button type="button" onClick={() => removePreviousWork(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addPreviousWork}>Add Previous Work</button>
        </div>
        <div>
            <label>Certification Images (comma separated URLs):</label>
            <input
                type="text"
                name="certificationImages"
                value={formData.certificationImages}
                onChange={(e) => handleChange({
                    target: {
                        name: 'certificationImages',
                        value: e.target.value.split(',').map(img => img.trim())
                    }
                })}
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
    </>
);

export default TourGuideForm;