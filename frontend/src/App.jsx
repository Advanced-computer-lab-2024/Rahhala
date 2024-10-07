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
import UpdateTouristAccount from './pages/UpdateTouristAccount';
import ViewAll from './pages/ViewAll';
import Activities from './pages/Activities';
import Museums from './pages/Museums';
import GovernorDashboard from './pages/GovernorDashboard';
import MuseumsList from './pages/MuseumsList';

import TouristItineraries from './pages/TouristItineraries';
import Guest from './pages/Guest';
import TourguideAccount from './pages/TourguideAccount';
import UpdateTourguideAccount from './pages/UpdateTourguideAccount';
import AdvertiserAccount from './pages/AdvertiserAccount';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import UpdateAdvertiserAccount from './pages/UpdateAdvertiserAccount';
import CreateActivity from './pages/CreateActivity';
import UpdateActivity from './pages/UpdateActivity';
import DeleteActivity from './pages/DeleteActivity';
import MyActivities from './pages/MyActivities';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/getMyActivities" element={<MyActivities />} />
                <Route path="/deleteActivity" element={<DeleteActivity />} />
                <Route path="/updateActivity" element={<UpdateActivity />} />
                <Route path="/createActivity" element={<CreateActivity />} />
                <Route path="/updateAdvertiserAccount" element={<UpdateAdvertiserAccount />} />
                <Route path="/advertiserAccount" element={<AdvertiserAccount />} />
                <Route path="/advertiser-dashboard" element={<AdvertiserDashboard />} />
                <Route path="/updateTourguideAccount" element={<UpdateTourguideAccount />} />
                <Route path="/tourguideAccount" element={<TourguideAccount />} />
                <Route path="/guest" element={<Guest />} />
                <Route path="/touristItineraries" element={<TouristItineraries />} />
                <Route path="/getMuseums" element={<Museums />} />
                <Route path="/getActivities" element={<Activities />} />
                <Route path="/viewAll" element={<ViewAll />} />
                <Route path="/updateTouristAccount" element={<UpdateTouristAccount />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/touristAccount" element={<TouristAccount />} />
                <Route path="/toursitUpdateAccount" element={<UpdateTouristAccount />} />
                <Route path="/tourguide-dashboard" element={<TourGuideDashboard />}/>
                <Route path="/createActivityCategory" element={<CreateActivityCategory />} />
                <Route path="/createTag" element={<CreateTag />} />
                <Route path="/showItineraries" element={<ItinerariesPage />} />
                <Route path="/GovernorDashboard" element={<GovernorDashboard />} />
                <Route path="/showAllMuseums" element={<MuseumsList />} />


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
