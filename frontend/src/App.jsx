import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import TourGuideProfileForm from "./TourGuideProfileForm";
import TourGuideProfileView from "./TourGuideProfileView";
import AdvertiserProfileForm from "./AdvertiserProfileForm";
import AdvertiserProfileView from "./AdvertiserProfileView";
import SellerProfile from "./SellerProfile";  // Import the SellerProfile component
import TouristProfile from "./TouristProfile";  // Import the TouristProfile component

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Registration Route */}
          <Route path="/" element={<RegistrationForm />} />
          
          {/* Tour Guide Profile Routes */}
          <Route path="/create-profile" element={<TourGuideProfileForm />} />
          <Route path="/profile/:email" element={<TourGuideProfileView />} />

          {/* Advertiser Profile Routes */}
          <Route path="/advertiser-profile" element={<AdvertiserProfileForm />} />
          <Route path="/advertiser-profile/:email" element={<AdvertiserProfileView />} />

          {/* Seller Profile Route */}
          <Route path="/seller-profile" element={<SellerProfile email="user@example.com" />} />
          
          {/* Tourist Profile Route */}
          <Route path="/profile/tourist" element={<TouristProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
