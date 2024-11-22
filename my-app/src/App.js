import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Login from './components/Login';
import Signup from './components/SignUp';
import Guest from './components/dashboards/GuestDashboard';
import Tourist from './components/dashboards/TouristDashboard';
import TouristProfile from './components/dashboards/Tourist/Profile';
import TouristBook from './components/dashboards/Tourist/Booking';
import TouristWallet from './components/dashboards/Tourist/Wallet';
import Products from './components/dashboards/Tourist/Products';
import Redeem from './components/dashboards/Tourist/Redeem';
import Complaints from './components/dashboards/Tourist/Complaints';

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
          <Route path="/tourist-profile" element={<TouristProfile />} />
          <Route path="/tourist-booking" element={<TouristBook />} />
          <Route path="/tourist-wallet" element={<TouristWallet />} />
          <Route path="/products" element={<Products />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/complaints" element={<Complaints />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
