import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const ViewDocuments = ({ userType }) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axiosInstance.get(`/api/${userType}/documents`);
                setDocuments(response.data.documents);
            } catch (err) {
                setError(`Failed to fetch documents: ${err.response?.data?.error || err.message}`);
            }
        };

        fetchDocuments();
    }, [userType]);

    return (
        <div>
            <h3>{userType.charAt(0).toUpperCase() + userType.slice(1)} Documents</h3>
            {error && <p>{error}</p>}
            <ul>
                {documents.map((doc, index) => (
                    <li key={index}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewDocuments;