import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CreateItinerary from './pages/CreateItinerary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/createItinerary"
                    element={
                        <ProtectedRoute>
                            <CreateItinerary />
                        </ProtectedRoute>
                    }
                />
                
                {/* Add other routes similarly */}
            </Routes>
        </Router>
    );
}

export default App;
