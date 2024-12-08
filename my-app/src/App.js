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
import AdminDashboard from './components/dashboards/Admin/AdminDashboard';
import NewAccountRequests from './components/dashboards/Admin/NewAccountRequests';
import AdminSalesReport from './components/dashboards/Admin/AdminSalesReport';
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
            <Route path="/tour-guide" element={<TourGuide />} />
            <Route path="/tour-guide-profile" element={<TourGProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new-account-requests" element={<NewAccountRequests />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/TourGuideSales" element={<SalesReport />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/admin/sales" element={<AdminSalesReport />} />


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;