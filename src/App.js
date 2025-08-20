import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ Add CartProvider import

// ✅ Auth Pages (stay under /pages)
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TrackingPage from "./pages/TrackingPage";

// ✅ Components (moved under /components)
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedRestaurants from "./components/FeaturedRestaurants";
import HowItWorks from "./components/HowItWorks";
import FeaturedDishes from "./components/FeaturedDishes";
import PromoSection from "./components/PromoSection";
import PromoHeader from "./components/PromoHeader";
import OfferCards from "./components/OfferCards";
import AboutUsSection from "./components/AboutUsSection";
import FoodGalleryRow from "./components/FoodGalleryRow";
import KeyHighlightsSection from "./components/KeyHighlightsSection";
import FooterSection from "./components/FooterSection";
import TestAddToCart from "./components/TestAddToCart";
import TestAdminAccess from "./components/TestAdminAccess";

import FoodCategorySection from "./components/FoodCategorySection";
import AllDishesPage from "./components/AllDishesPage";
import CartPage from "./pages/CartPage";

import OldSchoolEateryPage from "./components/OldSchoolEateryPage";
import DominosPizzaPage from "./components/DominosPizzaPage";
import LePrivePage from "./components/LePrivePage";
import SouthCafePage from "./components/SouthCafePage";
import SantoshPavBhajiPage from "./components/SantoshPavBhajiPage";
import UrbanBitesPage from "./components/UrbanBitesPage";
import PunjabiDhabaPage from "./components/PunjabiDhabaPage";
import RajasthaniRasoiPage from "./components/RajasthaniRasoiPage";
import TheChaatChaskaPage from "./components/TheChaatChaskaPage";
import MomosHutPage from "./components/MomosHutPage";

import "./App.css";

// Protected Route Component for Role-based Access
const ProtectedRoute = ({ children, requiredRole, fallbackPath = "/" }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return children;
};

// Role-based Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Default to regular dashboard for other roles
  return <Navigate to="/dashboard" replace />;
};

function LandingPage() {
  return (
    <>
      <HeroSection />
      
      <FeaturedRestaurants />
      <HowItWorks />
      <FeaturedDishes />
      <PromoHeader />
      <PromoSection />
      <OfferCards />
      <AboutUsSection />
      <FoodGalleryRow />
      <KeyHighlightsSection />
      <FooterSection />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* ✅ Wrap with CartProvider */}
        <Router>
          <div className="App">
            <Routes>
              {/* 🏠 Main Landing */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              } />

              {/* 🍽️ Food Sections */}
              <Route path="/categories" element={<FoodCategorySection />} />
              <Route path="/all-dishes" element={<AllDishesPage />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* 🧪 Test Routes */}
              <Route path="/test-admin" element={<TestAdminAccess />} />

              {/* 🍴 Restaurant Pages */}
              <Route path="/old-school-eatery" element={<OldSchoolEateryPage />} />
              <Route path="/dominos-pizza" element={<DominosPizzaPage />} />
              <Route path="/le-prive" element={<LePrivePage />} />
              <Route path="/south-cafe" element={<SouthCafePage />} />
              <Route path="/santosh-pav-bhaji" element={<SantoshPavBhajiPage />} />
              <Route path="/urban-bites" element={<UrbanBitesPage />} />
              <Route path="/punjabi-dhaba" element={<PunjabiDhabaPage />} />
              <Route path="/rajasthani-rasoi" element={<RajasthaniRasoiPage />} />
              <Route path="/the-chaat-chaska" element={<TheChaatChaskaPage />} />
              <Route path="/momos-hut" element={<MomosHutPage />} />

              {/* 📍 Order Tracking Routes */}
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/track/:orderId" element={<TrackingPage />} />

              {/* 🔐 Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/user-dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 👑 Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider> {/* ✅ Close CartProvider */}
    </AuthProvider>
  );
}

export default App;
