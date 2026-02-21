import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import './App.css';

import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import Auth from './pages/Auth';

// Placeholder Pages
const Custom = () => <div className="container section-padding" style={{ paddingTop: '120px' }}><h2>Personalizador</h2><p>Herramienta de diseño en construcción.</p></div>;

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <PayPalScriptProvider options={{
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            "disable-funding": "paylater,venmo",
            "data-fastlane": "false",
            "intent": "capture"
          }}>
            <div className="app">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/custom" element={<Custom />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/login" element={<Auth />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </PayPalScriptProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
