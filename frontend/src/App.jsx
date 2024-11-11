// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AccessDenied from './pages/AccessDenied';
import CreateItinerary from './pages/CreateItinerary';
import TourGuideDashboard from './pages/TourGuideDashboard';
import TouristAccount from './pages/TouristAccount';
import CreateActivityCategory from './pages/CreateActivityCategory';
import CreateTag from './pages/CreateTag';
import ItinerariesPage from './pages/ItinerariesPage';
import UpdateTouristAccount from './pages/UpdateTouristAccount';
import ViewAll from './pages/ViewAll';
import Activities from './pages/Activities';
import Museums from './pages/Museums';
import GovernorDashboard from './pages/GovernorDashboard';
import MuseumsList from './pages/MuseumsList';
import AdminDashboard from './pages/AdminDashboard';
import TouristItineraries from './pages/TouristItineraries';
import Guest from './pages/Guest';
import TourguideAccount from './pages/TourguideAccount';
import UpdateTourguideAccount from './pages/UpdateTourguideAccount';
import AdvertiserAccount from './pages/AdvertiserAccount';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import UpdateAdvertiserAccount from './pages/UpdateAdvertiserAccount';
import CreateActivity from './pages/CreateActivity';
import ActivityCategories from './pages/ActivityCategories';
import UpdateActivity from './pages/UpdateActivity';
import DeleteActivity from './pages/DeleteActivity';
import MyActivities from './pages/MyActivities';
import Products from './pages/Products';
import SellerAccount from './pages/SellerAccount';
import SellerDashboard from './pages/SellerDashboard';
import UpdateSellerAccount from './pages/UpdateSellerAccount';
import CreateProduct from './pages/CreateProduct';
import SubmitComplaint from './pages/submitComplaint';
import ViewTouristAccount from './pages/ViewTouristAccount';
import TouristDeleteAccount from './pages/TouristDeleteAccount';
import TouristBookings from './pages/TouristBookings';
import DeleteAccount from './components/DeleteAccount';
import PreferenceTagManagement from './pages/PreferenceTagManagement';
import ComplaintManagement from './pages/ComplaintManagement';
import UserManagement from './pages/UserManagement';    
import AccountDeletionRequests from './pages/AccountDeletionRequests';
import TouristChangePassword from './pages/TouristChangePassword';
import Wallet from './pages/wallet';
import RedeemLoyaltyPoints from './pages/RedeemLoyaltyPoints';
import TouristComplaints from './pages/TouristComplaints';
import GetActivity from './pages/GetActivity';
import GetItinerary from './pages/getItinerary';
import GetMuseum from './pages/getMuseum';
import MuseumTags from './pages/MuseumTags';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/guest" element={<Guest />} />
                <Route path="/products" element={<Products />} />
                <Route path="/getMyActivities" element={<MyActivities />} />
                <Route path="/deleteActivity" element={<DeleteActivity />} />
                <Route path="/updateActivity" element={<UpdateActivity />} />
                <Route path="/createActivity" element={<CreateActivity />} />
                <Route path="/createActivityCategory" element={<CreateActivityCategory />} />
                <Route path="/createTag" element={<CreateTag />} />
                <Route path="/showItineraries" element={<ItinerariesPage />} />
                <Route path="/viewAll" element={<ViewAll />} />
                <Route path="/getMuseums" element={<Museums />} />
                <Route path="/getActivities" element={<Activities />} />
                <Route path="/showAllMuseums" element={<MuseumsList />} />
                <Route path="/touristItineraries" element={<TouristItineraries />} />
                <Route path="/ActivityCategories" element={<ActivityCategories />} />
                <Route path="/submitComplaint" element={<SubmitComplaint />} />
                <Route path="/viewTouristAccount" element={<ViewTouristAccount />} />
                <Route path="/touristDeleteAccount" element={<TouristDeleteAccount />} />
                <Route path="/touristBookings" element={<TouristBookings />} />
                <Route path="/touristChangePassword" element={<TouristChangePassword />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/redeem" element={<RedeemLoyaltyPoints />} />
                <Route path="/myComplaints" element={<TouristComplaints />} />
                <Route path="/getActivity/:id" element={<GetActivity />} />
                <Route path="/getItinerary/:id" element={<GetItinerary />} />
                <Route path="/getMuseum/:id" element={<GetMuseum />} />
                <Route path="/museum-tags" element={<MuseumTags />} />
                <Route path="/createProduct" element={<CreateProduct />} />

                <Route
                    path="/updateSellerAccount"
                    element={
                        <ProtectedRoute roles={['seller']}>
                            <UpdateSellerAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/seller-dashboard"
                    element={
                        <ProtectedRoute roles={['seller']}>
                            <SellerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sellerAccount"
                    element={
                        <ProtectedRoute roles={['seller']}>
                            <SellerAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/updateAdvertiserAccount"
                    element={
                        <ProtectedRoute roles={['advertiser']}>
                            <UpdateAdvertiserAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/advertiserAccount"
                    element={
                        <ProtectedRoute roles={['advertiser']}>
                            <AdvertiserAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/advertiser-dashboard"
                    element={
                        <ProtectedRoute roles={['advertiser']}>
                            <AdvertiserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/updateTourguideAccount"
                    element={
                        <ProtectedRoute roles={['tourguide']}>
                            <UpdateTourguideAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tourguideAccount"
                    element={
                        <ProtectedRoute roles={['tourguide']}>
                            <TourguideAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/updateTouristAccount"
                    element={
                        <ProtectedRoute roles={['tourist']}>
                            <UpdateTouristAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/touristAccount"
                    element={
                            <TouristAccount />
                    }
                />
                <Route
                    path="/tourguide-dashboard"
                    element={
                        <ProtectedRoute roles={['tourguide']}>
                            <TourGuideDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/GovernorDashboard"
                    element={
                        <ProtectedRoute roles={['tourism_governor']}>
                            <GovernorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/AdminDashboard"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/createItinerary"
                    element={
                        <ProtectedRoute roles={['tourguide', 'admin']}>
                            <CreateItinerary />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/access-denied"
                    element={<AccessDenied />}
                />
                <Route
                    path="/deleteAccount"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <DeleteAccount />
                        </ProtectedRoute>
                    }
                />
        
                <Route path="/PreferenceTagManagement" 
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <PreferenceTagManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/complaintManagement"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <ComplaintManagement />
                        </ProtectedRoute>
                    }
                />
                <Route path="/userManagement" 
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/accountDeletionRequests"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <AccountDeletionRequests />
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