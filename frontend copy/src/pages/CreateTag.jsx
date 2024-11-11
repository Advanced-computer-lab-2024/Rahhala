import React, { useState } from 'react';

const CreateTag = () => {
    const [tagName, setTagName] = useState('');
    const [tagDescription, setTagDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Tag Name:', tagName);
        console.log('Tag Description:', tagDescription);
    };

    return (
        <div>
            <h1>Create a New Tag</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="tagName">Tag Name:</label>
                    <input
                        type="text"
                        id="tagName"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="tagDescription">Tag Description:</label>
                    <textarea
                        id="tagDescription"
                        value={tagDescription}
                        onChange={(e) => setTagDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Tag</button>
            </form>
        </div>
    );
};

export default CreateTag;