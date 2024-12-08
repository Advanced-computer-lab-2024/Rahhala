import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const AdminComplaints = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState({});
    const [reply, setReply] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axiosInstance.get('/api/complaint');
                setComplaints(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };
    
        fetchComplaints();
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleResolve = async (id, status) => {
        try {
            await axiosInstance.put(`/api/complaint/markResolved/${id}`, { status });
            alert('Complaint status updated successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error updating complaint status:', error);
            alert(error.response.data.message || error.response.data.error || 'Error updating complaint status.');
        }
    };

    const handleReplySubmit = async (id) => {
        try {
            await axiosInstance.put(`/api/complaint/${id}`, { reply });
            alert('Reply submitted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert(error.response.data.message || error.response.data.error || 'Error updating complaint status.');
        }
    };


    const renderMoreInfoModal = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-lg bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl text-center font-bold mb-4">Complaint Details</h2>
                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                <p><strong>Body:</strong> {selectedComplaint.body}</p>
                <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={selectedComplaint.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>{selectedComplaint.status}</span></p>
                <div>
                <label><strong>Reply:</strong></label>
                <input 
                    type="text" 
                    value={reply} 
                    onChange={(e) => setReply(e.target.value)}   
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
                </div>
                <button
                onClick={() => {
                    setMoreInfoModalOpen(false);
                    setSelectedComplaint({});
                }}
                className="mt-4 bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                Close
                </button>
                &nbsp; &nbsp;
                <button 
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    onClick={() => handleReplySubmit(selectedComplaint._id)}
                >
                Submit / Edit Reply
                </button>
                &nbsp; &nbsp;
                {selectedComplaint.status === 'pending' && (
                <button 
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                    onClick={() => handleResolve(selectedComplaint._id, 'resolved')}
                >
                    Mark as Resolved
                </button>
                )}
            </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>
            {moreInfoModalOpen && renderMoreInfoModal()}
            <div className="flex justify-center mt-20">
                <div className="space-y-4 w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl text-center font-bold mb-4">Complaints</h2>
                    <table className="min-w-full bg-white border border-gray-200 text-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-6 border-b border-gray-200 text-center">Title</th>
                                <th className="py-2 px-6 border-b border-gray-200 text-center">Status</th>
                                <th className="py-2 px-6 border-b border-gray-200 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody >
                            {complaints.map((complaint) => (
                                <tr 
                                    key={complaint._id} className="hover:bg-gray-100"
                                    onClick={() => {setSelectedComplaint(complaint); setMoreInfoModalOpen(true); setReply(complaint.reply)}}
                                >
                                    <td className="py-2 px-6 border-b border-gray-200 text-center font-bold italic text-blue-800">{complaint.title}</td>
                                    <td className={`py-2 px-6 border-b border-gray-200 text-center ${complaint.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>{complaint.status}</td>
                                    <td className="py-2 px-6 border-b border-gray-200 text-center">{new Date(complaint.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminComplaints;