import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CreateItinerary from './pages/CreateItinerary';
import ProtectedRoute from './components/ProtectedRoute';
import TouristDashboard from './pages/TouristDashboard';
import TouristAccount from './pages/TouristAccount';
import CreateActivityCategory from './pages/CreateActivityCategory';
import CreateTag from './pages/CreateTag';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/touristAccount" element={<TouristAccount />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/createActivityCategory" element={<CreateActivityCategory />} />
                <Route path="/createTag" element={<CreateTag />} />
                <Route
                    path="/createItinerary"
                    element={
                        <ProtectedRoute>
                            <CreateItinerary />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tourist-dashboard"
                    element={
                        <ProtectedRoute >
                            <TouristDashboard />
                        </ProtectedRoute>
                    }
                />
                
                {/* Add other routes similarly */}
            </Routes>
        </Router>
    );
}

export default App;
