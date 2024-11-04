import React, { useState } from 'react';

const CreateActivityCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Category Name:', categoryName);
        console.log('Category Description:', categoryDescription);
    };

    return (
        <div>
            <h1>Create a New Activity Category</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categoryDescription">Category Description:</label>
                    <textarea
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Category</button>
            </form>
        </div>
    );
};

export default CreateActivityCategory;