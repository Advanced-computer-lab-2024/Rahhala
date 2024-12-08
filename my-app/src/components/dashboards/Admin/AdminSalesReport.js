import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';

const AdminSalesReport = () => {
    const { auth } = useContext(AuthContext);
    const [totalSales, setTotalSales] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showActivities, setShowActivities] = useState(true);
    const [showUserStats, setshowUserStats] = useState(true);

    const [showItineraries, setShowItineraries] = useState(true);
    const [showProducts, setShowProducts] = useState(true);
    const [userStatistics, setUserStatistics] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await axiosInstance.get('/api/sale/totalSales');
                setTotalSales(response.data);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchTotalSales();
    }, [auth]);

    useEffect(() => {
        const fetchUserStatistics = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/userStats');
                console.log("response is", response.data);
                setUserStatistics(response.data);
                console.log("user stats", userStatistics);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchUserStatistics();
    }, [auth]);

    const handleFilter = async () => {
        try {
            const response = await axiosInstance.post('/api/sale/filterSalesReport', {
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            });
            console.log("response is", response.data);
            setTotalSales(response.data);
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
                <h1 className="text-2xl font-bold">Admin Sales Report</h1>
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
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/admin')}>Home</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/admin-profile')}>Profile</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/adminSales')}>Sales Report</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/adminNotifications')}>Notifications</li>
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
                            onClick={() => setShowProducts(!showProducts)}
                            className={`px-4 py-2 rounded ${showProducts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Products
                        </button>

                        <button
                            onClick={() => setshowUserStats(!showUserStats)}
                            className={`px-4 py-2 rounded ${showUserStats ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            User Statistics
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
                    {totalSales ? (
                        <>
                            {showActivities && (
                                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                    <h3 className="text-lg font-semibold mb-4">Activities Sales Summary</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Count:</strong>
                                            <p>{totalSales.activities.count}</p>
                                        </div>
                                        <div>
                                            <strong>Total Revenue:</strong>
                                            <p>${totalSales.activities.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showItineraries && (
                                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                    <h3 className="text-lg font-semibold mb-4">Itineraries Sales Summary</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Count:</strong>
                                            <p>{totalSales.itineraries.count}</p>
                                        </div>
                                        <div>
                                            <strong>Total Revenue:</strong>
                                            <p>${totalSales.itineraries.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showProducts && (
                                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                                    <h3 className="text-lg font-semibold mb-4">Products Sales Summary</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Count:</strong>
                                            <p>{totalSales.products.count}</p>
                                        </div>
                                        <div>
                                            <strong>Total Revenue:</strong>
                                            <p>${totalSales.products.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showUserStats && userStatistics &&  (
                        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                            <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
                            <div className="space-y-2">
                            <h3 className="text-lg font-semibold mb-4">Total Users</h3>
                            <div className="flex space-x-4">
                            <div><strong>Tourists : {userStatistics.totalUsers.tourists}</strong></div>
                            <div><strong>Tour Guides : {userStatistics.totalUsers.tourguides}</strong></div>
                            <div><strong>Advertisers : {userStatistics.totalUsers.advertisers}</strong></div>
                            <div><strong>Sellers : {userStatistics.totalUsers.sellers}</strong></div>
                        </div>
                                <h4 className="text-md font-semibold">New Users Per Month</h4>
                                {Object.entries(userStatistics.newUsersPerMonth).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key}:</strong>
                                        <div className="flex space-x-4">
                                            {value.map((monthData, index) => (
                                                <div key={index}>
                                                    <strong>{monthData._id}:</strong>
                                                    <p>{monthData.count}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                        </>
                    ) : (
                        <p>No sales report available.</p>
                    )}
                    {/* {showEngagement && (
                        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative">
                            <h3 className="text-lg font-semibold mb-4">Tourist Engagement</h3>
                            {totalSales.engagement ? (
                                <div className="space-y-2">
                                    {Object.entries(totalSales.engagement).map(([key, value]) => (
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
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default AdminSalesReport;