import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';

const SalesReport = () => {
    const { auth } = useContext(AuthContext);
    const [salesReport, setSalesReport] = useState(null);
    const [engagement, setEngagement] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showActivities, setShowActivities] = useState(true);
    const [showItineraries, setShowItineraries] = useState(true);
    const [showEngagement, setShowEngagement] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const response = await axiosInstance.get('/api/sale/salesReport');
                setSalesReport(response.data);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchSalesReport();
    }, [auth]);

    useEffect(() => {
        const fetchTouristEngagement = async () => {
            try {
                const response = await axiosInstance.get('/api/sale/totalTourists');
                setEngagement(response.data);
                console.log("engagement", response.data);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchTouristEngagement();
    }, [auth]);

    const handleFilter = async () => {
        try {
            const response = await axiosInstance.post('/api/sale/filterTotalTourists', {
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            });
            console.log("response is", response.data);
            console.log("start date", startDate);
            console.log("end date", endDate);   
            setEngagement(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
                <h1 className="text-2xl font-bold">Sales Report</h1>
                <div className="flex items-center ml-auto space-x-4 relative">
                    <button onClick={toggleDropdown} className="p-2">
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white mb-1"></span>
                        <span className="block w-6 h-1 bg-white"></span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                            <ul className="text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide')}>Home</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide-profile')}>Profile</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourGuideSales')}>Sales Report</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourGuideNotifications')}>Notifications</li>
                                <li className="px-4 py-2 hover:bg-red-200 cursor-pointer text-red-600" onClick={() => (window.location.href = '/login')}>Sign Out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex-1 p-6 flex flex-col items-center">
                <div className="space-y-6 w-full max-w-4xl flex flex-col items-center">
                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={() => setShowActivities(!showActivities)}
                            className={`px-4 py-2 rounded ${showActivities ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Activities
                        </button>
                        <button
                            onClick={() => setShowItineraries(!showItineraries)}
                            className={`px-4 py-2 rounded ${showItineraries ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Itineraries
                        </button>
                        <button
                            onClick={() => setShowEngagement(!showEngagement)}
                            className={`px-4 py-2 rounded ${showEngagement ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Tourist Engagement
                        </button>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded"
                        />
                        <button
                            onClick={handleFilter}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Filter
                        </button>
                    </div>
                    {salesReport ? (
                        <>
                            {showActivities && (
                                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                    <h3 className="text-lg font-semibold mb-4">Your Activities Summary</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Count:</strong>
                                            <p>{salesReport.activities.count}</p>
                                        </div>
                                        <div>
                                            <strong>Total Revenue:</strong>
                                            <p>${salesReport.activities.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showItineraries && (
                                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                    <h3 className="text-lg font-semibold mb-4">Your Itineraries Summary</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Count:</strong>
                                            <p>{salesReport.itineraries.count}</p>
                                        </div>
                                        <div>
                                            <strong>Total Revenue:</strong>
                                            <p>${salesReport.itineraries.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No sales report available.</p>
                    )}
                    {showEngagement && (
                        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                            <h3 className="text-lg font-semibold mb-4">Tourist Engagement</h3>
                            {engagement ? (
                                <div className="space-y-2">
                                    {Object.entries(engagement).map(([key, value]) => (
                                        <div key={key}>
                                            <strong>{key}:</strong>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No engagement data available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;