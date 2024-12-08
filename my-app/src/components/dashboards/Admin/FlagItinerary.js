import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const FlagItinerary = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getItineraries = async () => {
            try {
                const response = await axiosInstance.get('/api/itinerary/');
                setItineraries(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getItineraries();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleMoreInfo = (itinerary) => {
        setSelectedItinerary(itinerary);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItinerary(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleFlag = async (itinerary) => {
        try {
            await axiosInstance.put('/api/itinerary/flag', { id: itinerary._id });
            const updatedItineraries = itineraries.map((it) => {
                if (it._id === itinerary._id) {
                    return { ...it, flagged: true };
                }
                return it;
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleUnflag = async (itinerary) => {
        try {
            await axiosInstance.put(`/api/itinerary/unflag/${itinerary._id}`);
            const updatedItineraries = itineraries.map((it) => {
                if (it._id === itinerary._id) {
                    return { ...it, flagged: false };
                }
                return it;
            });
            setItineraries(updatedItineraries);
        } catch (err) {
            console.log(err);
        }
    }


    const renderItineraries = () => {
        return itineraries.map((itinerary) => (
            <div key={itinerary._id} className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-semibold">{itinerary.name}</h3>
                <p className="text-gray-600">{itinerary.timeline}</p>
                <p className="text-lg font-semibold text-blue-500">${itinerary.price}</p>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                onClick={() => handleMoreInfo(itinerary)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                More Info
                </button>
                {itinerary.flagged ? (
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => handleUnflag(itinerary)}
                >
                    Unflag
                </button>
                ) : (
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleFlag(itinerary)}
                >
                    Flag
                </button>
                )}
            </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl font-bold mb-4">Itineraries</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderItineraries()}
                    </div>
                </div>
            </div>

            {modalOpen && selectedItinerary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">{selectedItinerary.name}</h2>
                        <div className="space-y-4">
                            <p className="text-gray-700"><strong>Timeline:</strong> {selectedItinerary.timeline}</p>
                            <p className="text-gray-700"><strong>Price:</strong> ${selectedItinerary.price}</p>
                            <p className="text-gray-700"><strong>Language:</strong> {selectedItinerary.language}</p>
                            <p className="text-gray-700"><strong>Pickup Location:</strong> {selectedItinerary.pickupLocation}</p>
                            <p className="text-gray-700"><strong>Dropoff Location:</strong> {selectedItinerary.dropoffLocation}</p>
                            <p className="text-gray-700"><strong>Tags:</strong> {selectedItinerary.tags.join(', ')}</p>
                            <p className="text-gray-700"><strong>Accessibility:</strong> {selectedItinerary.accessibility.join(', ')}</p>
                            <p className="text-gray-700"><strong>Available Dates:</strong> {selectedItinerary.availableDates.map(formatDate).join(', ')}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlagItinerary;