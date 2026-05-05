import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components (We will create these soon)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages (We will create these soon)
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 min-vh-100-nav">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} /> 
            <Route path="/product/:id" element={<ProductDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;
