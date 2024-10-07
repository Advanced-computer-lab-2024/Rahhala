import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CreateItinerary from './pages/CreateItinerary';
import ProtectedRoute from './components/ProtectedRoute';
import TourGuideDashboard from './pages/TourGuideDashboard';
import TouristAccount from './pages/TouristAccount';
import CreateActivityCategory from './pages/CreateActivityCategory';
import { Navigate } from 'react-router-dom';
import CreateTag from './pages/CreateTag';
import ItinerariesPage from './pages/ItinerariesPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/touristAccount" element={<TouristAccount />} />
                <Route path="/tourguide-dashboard" element={<TourGuideDashboard />}/>
                <Route path="/createActivityCategory" element={<CreateActivityCategory />} />
                <Route path="/createTag" element={<CreateTag />} />
                <Route path="/showItineraries" element={<ItinerariesPage />} />
                <Route
                    path="/createItinerary"
                    element={
                        <ProtectedRoute>
                            <CreateItinerary />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
               

        </Router>
    );
}

export default App;
