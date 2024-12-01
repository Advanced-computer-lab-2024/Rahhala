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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
        try {
            const res = await axiosInstance.get("/api/complaint/");
            setComplaints(res.data);
        } catch (error) {
            console.log(error);
        }
        };

        fetchComplaints();
    }, [auth]);



    const handleSubmitComplaint = async () => {
        try{
            const response = await axiosInstance.post("/api/complaint/", {title: title, body: body});
            console.log(response.data);
            setTitle("");
            setBody("");
            setIsSubmitted(true);
            window.location.reload();
        }
        catch(error){
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <Header />
        <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
        >
            ← Back
        </button>

        
        <div className="flex justify-center items-center mt-20">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6 text-center">Submit a Complaint</h1>

            
            <div className="mb-6">
                <div className="mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                </div>
                <div className="mb-4">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe your complaint"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                </div>
                <button
                onClick={handleSubmitComplaint}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                Submit Complaint
                </button>

                {isSubmitted && (
                <p className="mt-4 text-center text-green-500">Complaint submitted successfully!</p>
                )}
            </div>


            <h2 className="text-xl font-semibold mb-4 text-center">Past Complaints</h2>

            <div className="space-y-4">
                {complaints.length === 0 ? (
                <p className="text-center text-gray-500">No complaints yet.</p>
                ) : (
                complaints.map((complaint, index) => (
                    <div key={index} className="p-4 border border-gray-300 rounded-md">
                    <h3 className="font-semibold text-lg">{complaint.title}</h3>
                    <p className="text-sm text-gray-500">Submitted on: {complaint.date}</p>
                    <p className="mt-2">{complaint.body}</p>
                    <p className={`mt-2 text-sm ${complaint.status === "resolved" ? "text-green-500" : "text-yellow-500"}`}>
                        Status: {complaint.status}
                    </p>
                    <div className="mt-4">
                        <p className="font-semibold">Reply (Admin):</p>
                        <p className="text-gray-500">
                        {complaint.reply ? complaint.reply : "No reply yet."}
                        </p>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>
        </div>
    );
}

export default ComplaintsPage;
