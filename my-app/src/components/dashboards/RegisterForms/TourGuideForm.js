import React from 'react';

const TourGuideForm = ({ formData, handleChange, handlePreviousWorkChange, addPreviousWork, removePreviousWork, handleFileChange }) => {
    return (
        <div className="space-y-4">
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
                <label className="block text-gray-700">  Previous Work :</label>
                {formData.previousWork.map((work, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={work.yearsOfExperience}
                            onChange={(e) => handlePreviousWorkChange(index, e)}
                            placeholder="Years of Experience"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="work"
                            value={work.work}
                            onChange={(e) => handlePreviousWorkChange(index, e)}
                            placeholder="Work Description"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => removePreviousWork(index)}
                            className="w-full p-3 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addPreviousWork}
                    className="w-full p-3 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Add Another Previous Work
                </button>
            </div>
            <div>
                <label className="block text-gray-700">Certification Images:</label>
                <input
                    type="file"
                    name="certificationImages"
                    onChange={handleFileChange}
                    multiple
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-gray-700">ID Card Image:</label>
                <input
                    type="file"
                    name="idCardImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-gray-700">Profile Photo:</label>
                <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
    );
};

export default TourGuideForm;