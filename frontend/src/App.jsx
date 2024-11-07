import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import TourGuideProfileForm from "./TourGuideProfileForm";
import TourGuideProfileView from "./TourGuideProfileView";
import AdvertiserProfileForm from "./AdvertiserProfileForm";
import AdvertiserProfileView from "./AdvertiserProfileView";
import SellerProfile from "./SellerProfile";
import TouristProfile from "./TouristProfile";
import ChangePassword from "./ChangePassword";
import UploadDocuments from "./UploadDocuments";
import UploadProfilePicture from "./UploadProfilePicture"; // Import the UploadProfilePicture component
import AdminReviewDocuments from "./AdminReviewDocuments";
import AcceptTermsConditions from "./AcceptTermsConditions";
import DeleteAccountRequest from "./DeleteAccountRequest";
import ItineraryManagement from "./ItineraryManagement";
import FlagEvent from "./FlagEvent";
import VacationPreferences from "./VacationPreferences";
import ActivityCategories from "./ActivityCategories";
import ShareActivity from "./ShareActivity";
import CurrencySelector from "./CurrencySelector";
import RateTourGuide from "./RateTourGuide";
import CommentOnTourGuide from "./CommentOnTourGuide";
import RateAndCommentItinerary from "./RateAndCommentItinerary";
import RateAndCommentEventActivity from "./RateAndCommentEventActivity";
import BookingActivity from "./BookingActivity";
import LoyaltyPoints from "./LoyaltyPoints";
import TouristBadge from "./TouristBadge";
import RedeemPoints from "./RedeemPoints";
import FileComplaint from "./FileComplaint";
import RateProduct from "./RateProduct";
import ReviewProduct from "./ReviewProduct";
import MyComplaints from "./MyComplaints";
import AdminComplaints from "./AdminComplaints";
import ComplaintDetail from "./ComplaintDetail";
import AdminReplyToComplaint from "./AdminReplyToComplaint";
import ProductOverview from "./components/ProductOverview";
import ProductImageUpload from "./components/ProductImageUpload";
import ProductList from "./components/ProductList";



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

          {/* Change Password Routes */}
          <Route path="/change-password/tourist" element={<ChangePassword userRole="tourist" />} />
          <Route path="/change-password/tour-guide" element={<ChangePassword userRole="tourGuide" />} />
          <Route path="/change-password/advertiser" element={<ChangePassword userRole="advertiser" />} />
          <Route path="/change-password/governor" element={<ChangePassword userRole="governor" />} />
          <Route path="/change-password/admin" element={<ChangePassword userRole="admin" />} />
          <Route path="/change-password/seller" element={<ChangePassword userRole="seller" />} />

           {/* Document Upload Route for Guests */}
           <Route path="/upload-documents" element={<UploadDocuments />} />

          {/* Profile Picture Upload Routes */}
          <Route path="/upload-profile-picture/tour-guide" element={<UploadProfilePicture userRole="tourGuide" />} />
          <Route path="/upload-profile-picture/advertiser" element={<UploadProfilePicture userRole="advertiser" />} />
          <Route path="/upload-profile-picture/seller" element={<UploadProfilePicture userRole="seller" />} />

          {/* Admin review documents route */}
          <Route path="/admin/review-documents" element={<AdminReviewDocuments />} />

          {/* Accept Terms and Conditions Routes */}
          <Route path="/accept-terms/tour-guide" element={<AcceptTermsConditions userRole="tourGuide" />} />
          <Route path="/accept-terms/advertiser" element={<AcceptTermsConditions userRole="advertiser" />} />
          <Route path="/accept-terms/seller" element={<AcceptTermsConditions userRole="seller" />} />
          <Route path="/accept-terms/tourist" element={<AcceptTermsConditions userRole="tourist" />} />

          {/* Delete Account Request Routes */}
          <Route path="/delete-account/tourist" element={<DeleteAccountRequest userRole="tourist" />} />
          <Route path="/delete-account/tour-guide" element={<DeleteAccountRequest userRole="tourGuide" />} />
          <Route path="/delete-account/advertiser" element={<DeleteAccountRequest userRole="advertiser" />} />
          <Route path="/delete-account/seller" element={<DeleteAccountRequest userRole="seller" />} />

          {/* Itinerary Management Route */}
          <Route path="/manage-itineraries" element={<ItineraryManagement />} />

           {/* Flag Event/Itinerary Route */}
           <Route path="/flag-event" element={<FlagEvent />} />

           {/* Vacation Preferences Route */}
          <Route path="/vacation-preferences" element={<VacationPreferences />} />

          {/* Activity Categories Route */}
          <Route path="/activity-categories" element={<ActivityCategories />} />

          {/* Share Activity Route */}
          <Route path="/share-activity/:id" element={<ShareActivity />} />

          {/* Currency Selector Route */}
          <Route path="/currency-selector" element={<CurrencySelector />} />

          {/* Rate Tour Guide Route */}
          <Route path="/rate-tour-guide" element={<RateTourGuide />} />

          {/* Comment on Tour Guide Route */}
          <Route path="/comment-tour-guide" element={<CommentOnTourGuide />} />

          {/* Rate and Comment on Itinerary Route */}
          <Route path="/rate-comment-itinerary" element={<RateAndCommentItinerary />} />

           {/* Rate and Comment on Event/Activity Route */}
           <Route path="/rate-comment-event" element={<RateAndCommentEventActivity />} />

           {/* Booking and Canceling Activity/Event Route */}
          <Route path="/booking-activity" element={<BookingActivity />} />

          {/* Loyalty Points Route */}
          <Route path="/earn-loyalty-points" element={<LoyaltyPoints touristLevel={1} />} />

           {/* Tourist Badge Route */}
           <Route path="/tourist-badge" element={<TouristBadge />} />

           {/* Redeem Points Route */}
          <Route path="/redeem-points" element={<RedeemPoints />} />

          {/* File Complaint Route */}
          <Route path="/file-complaint" element={<FileComplaint />} />

           {/* Rate Product Route */}
           <Route path="/rate-product/:productId" element={<RateProduct />} />

            {/* Review Product Route */}
          <Route path="/product/:productId/review" element={<ReviewProduct />} />

          <Route path="/my-complaints" element={<MyComplaints />} />

          {/* Admin Complaints Route */}
          <Route path="/admin/complaints" element={<AdminComplaints />} />

           {/* Admin Complaint Detail Route */}
           <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />

           <Route path="/admin/complaint/:complaintId/reply" element={<AdminReplyToComplaint />} />

           <Route path="/product-overview" element={<ProductOverview />} />

           <Route path="/product/:id/upload-image" element={<ProductImageUpload />} />

           <Route path="/admin/products" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
