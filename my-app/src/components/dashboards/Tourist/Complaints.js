import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Header from "../../Header.js";

function ComplaintsPage() {
    const { auth } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const statusOptions = ['all', 'pending', 'resolved'];
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    // Add this helper function after other const declarations
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    useEffect(() => {
        fetchComplaints();
    }, [auth]);

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/api/complaint/");
            setComplaints(res.data);
        } catch (error) {
            setError("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        setError("");
        
        try {
            await axiosInstance.post("/api/complaint/", {title, body});
            setTitle("");
            setBody("");
            await fetchComplaints(); // Refresh complaints list
        } catch(error) {
            setError("Failed to submit complaint");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFilteredComplaints = () => {
        if (filter === 'all') return complaints;
        return complaints.filter(complaint => complaint.status === filter);
    };

    // Enhanced StatusBadge
    const StatusBadge = ({ status }) => (
        <span className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
            status === "resolved" 
                ? "bg-green-100 text-green-800 ring-1 ring-green-200" 
                : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
        }`}>
            {capitalizeFirst(status)}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center hover:text-blue-600 transition-colors"
            >
                ← Back
            </button>
            
            <div className="flex justify-center items-center mt-10 px-4">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-8 text-center">Submit a Complaint</h1>
                    
                    <form onSubmit={handleSubmitComplaint} className="mb-12 space-y-6 transition-all duration-200">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Describe your complaint"
                                rows="4"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg 
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
                                transition-all duration-200`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>

                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-center">Past Complaints</h2>
                        <div className="flex items-center gap-2">
                            <label htmlFor="status-filter" className="text-sm text-gray-600">
                                Filter by status:
                            </label>
                            {/* Update the filter options mapping in the select element */}
                            <select
                                id="status-filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>
                                        {capitalizeFirst(option)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : getFilteredComplaints().length === 0 ? (
                        // Update the "No complaints found" message
                        <p className="text-center text-gray-500 py-8">
                            No {filter !== 'all' ? capitalizeFirst(filter) : ''} complaints found.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {getFilteredComplaints().map((complaint, index) => (
                                <div key={index} className="group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 bg-white hover:border-gray-300">
                                    <div className="flex justify-between items-start space-x-4">
                                        <h3 className="font-semibold text-xl group-hover:text-blue-600 transition-colors">{complaint.title}</h3>
                                        <StatusBadge status={complaint.status} />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3">
                                        Submitted on: {formatDate(complaint.date)}
                                    </p>
                                    <p className="mt-4 text-gray-700">{complaint.body}</p>
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="font-semibold text-gray-700 mb-2">Admin Response:</p>
                                        <p className="text-gray-600">
                                            {complaint.reply || "No reply yet."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComplaintsPage;
