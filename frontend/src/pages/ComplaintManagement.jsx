import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './ComplaintManagement.css';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [reply, setReply] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axiosInstance.get('/api/complaint');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleComplaintClick = (complaint) => {
        setSelectedComplaint(complaint);
        setReply(complaint.reply || '');
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axiosInstance.put(`/api/complaint/markResolved/${id}`, { status });
            fetchComplaints();
            setMessage('Complaint status updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating complaint status:', error);
            setMessage('Error updating complaint status.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleReplySubmit = async (id) => {
        try {
            await axiosInstance.put(`/api/complaint/${id}`, { reply });
            fetchComplaints();
            setMessage('Reply submitted successfully!');
            setReply(''); // Clear the text box
            setSelectedComplaint(null); // Hide the Complaint Details section
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error submitting reply:', error);
            setMessage('Error submitting reply.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        return statusFilter ? complaint.status === statusFilter : true;
    });

    const sortedComplaints = filteredComplaints.sort((a, b) => {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });

    return (
        <div className="complaint-management">
            <h2>Complaint Management</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            <div className="controls">
                <label>
                    Filter by status:
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </label>
                <label>
                    Sort by date:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedComplaints.map(complaint => (
                        <tr
                            key={complaint._id}
                            onClick={() => handleComplaintClick(complaint)}
                            className={selectedComplaint && selectedComplaint._id === complaint._id ? 'selected' : ''}
                        >
                            <td>{complaint.title}</td>
                            <td>{complaint.status}</td>
                            <td>{new Date(complaint.date).toLocaleString()}</td>
                            <td>
                                {complaint.status === 'pending' ? (
                                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(complaint._id, 'resolved'); }}>
                                        Mark as Resolved
                                    </button>
                                ) : (
                                    'Resolved'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedComplaint && (
                <div className="complaint-details">
                    <h3>Complaint Details</h3>
                    <p><strong>Title:</strong> {selectedComplaint.title}</p>
                    <p><strong>Body:</strong> {selectedComplaint.body}</p>
                    <p><strong>Status:</strong> {selectedComplaint.status}</p>
                    <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleString()}</p>
                    {selectedComplaint.reply && (
                        <p><strong>Reply:</strong> {selectedComplaint.reply}</p>
                    )}
                    <div>
                        <label>Reply:</label>
                        <textarea value={reply} onChange={(e) => setReply(e.target.value)} />
                        <button onClick={() => handleReplySubmit(selectedComplaint._id)}>Submit Reply</button>
                    </div>
                </div>
            )}
            <div className="navigation-buttons">
                <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
                <Logout />
            </div>
        </div>
    );
};

export default ComplaintManagement;