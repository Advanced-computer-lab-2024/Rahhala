import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import Guest from './components/dashboards/GuestDashboard';
import Tourist from './components/dashboards/TouristDashboard';
import Governor from './components/dashboards/GovernorDashboard';
import TouristProfile from './components/dashboards/Tourist/Profile';
import TouristBook from './components/dashboards/Tourist/Booking';
import TouristWallet from './components/dashboards/Tourist/Wallet';
import Products from './components/dashboards/Tourist/Products';
import Redeem from './components/dashboards/Tourist/Redeem';
import Complaints from './components/dashboards/Tourist/Complaints';
import { AuthProvider } from './context/AuthContext';
import TourGuide from './components/dashboards/TourGuideDashboard';
import TourGProfile from './components/dashboards/TourGuide/Profile';
import ResetPassword from './components/ResetPassword';
import SalesReport from './components/dashboards/TourGuide/SalesReport';
import Notifications from './components/dashboards/Notifications';
import AdminManagment from './components/dashboards/Admin/AdminManagment';
import NewAccountRequests from './components/dashboards/Admin/NewAccountRequests';
import AccountDeletionRequest from './components/dashboards/Admin/AccountDeletionRequest';
import PreferenceTags from './components/dashboards/Admin/PreferenceTags';
import AddUser from './components/dashboards/Admin/AddUser';
import ActivityCategories from './components/dashboards/Admin/ActivityCategories';
import AdminComplaints from './components/dashboards/Admin/Complaints';
import AdminDashboard from './components/dashboards/Admin/AdminDashboard';
import DeleteAccount from './components/dashboards/Admin/DeleteAccount';
import AdminSalesReport from './components/dashboards/Admin/AdminSalesReport';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import AdvertiserAccount from './components/dashboards/Advertiser/AdvertiserAccount';
import UpdateAdvertiserAccount from './components/dashboards/Advertiser/UpdateAdvertiserAccount';
import AdminProducts from './components/dashboards/Admin/AdminProducts';
import FlagItinerary from './components/dashboards/Admin/FlagItinerary';
import ManageActivities from './components/dashboards/Advertiser/ManageActivities';
import SellerDashBoard from './components/dashboards/Seller/SellerDashBoard';
import SellerProducts from './components/dashboards/Seller/SellerProducts';
import TouristOrders from './components/dashboards/Tourist/TouristOrders';
import Flights from './components/dashboards/Tourist/Flights';
function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/guest" element={<Guest />} />
                <Route path="/tourist" element={<Tourist />} />
                <Route path="/governor" element={<Governor />} />
                <Route path="/tourist-profile" element={<TouristProfile />} />
                <Route path="/tourist-booking" element={<TouristBook />} />
                <Route path="/tourist-wallet" element={<TouristWallet />} />
                <Route path="/products" element={<Products />} />
                <Route path="/redeem" element={<Redeem />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/tourist-orders" element={<TouristOrders />} />
                <Route path="/tour-guide" element={<TourGuide />} />
                <Route path="/tour-guide-profile" element={<TourGProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/management" element={<AdminManagment />} />
                <Route path="/admin/new-account-requests" element={<NewAccountRequests />} />
                <Route path="/admin/account-deletion-requests" element={<AccountDeletionRequest />} />
                <Route path="/admin/preference-tags" element={<PreferenceTags />} />
                <Route path="/admin/add-user" element={<AddUser />} />
                <Route path="/admin/activity-categories" element={<ActivityCategories />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/delete-account" element={<DeleteAccount />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/flag-itinerary" element={<FlagItinerary />} />
                <Route path="/admin/sales" element={<AdminSalesReport />} />
                <Route path="/advertiser" element={<AdvertiserDashboard />} />
                <Route path="/advertiserAccount" element={<AdvertiserAccount />} />
                <Route path="/UpdateAdvertiserAccount" element={<UpdateAdvertiserAccount />} />
                <Route path="/manage-activities" element={<ManageActivities />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/TourGuideSales" element={<SalesReport />} />
                <Route path="/Notifications" element={<Notifications />} />
                <Route path="/seller" element={<SellerDashBoard />} />
                <Route path="/seller-products" element={<SellerProducts />} />
                <Route path="/flights" element={<Flights />} />
            </Routes>
        </Router>
    </AuthProvider>
    );
}

export default App;