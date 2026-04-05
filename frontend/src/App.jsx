import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Profiles from './pages/Profiles';
import Home from './pages/Home';
import Login from './pages/Login';
import useStore from './store/useStore';
import api from './api/axios';

import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/ProductDetails';
import Vault from './pages/Vault';
import Footer from './components/Footer';

function App() {
  const setUser = useStore(state => state.setUser);
  const user = useStore(state => state.user);
  const activeProfile = useStore(state => state.activeProfile);

  useEffect(() => {
    // Basic persistent login check
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Decode JWT roughly or verify
      api.get('/user/profile')
         .then(res => {
            setUser({ id: res.data.user_id });
         })
         .catch(() => {
            // token invalid
            localStorage.removeItem('token');
         });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="font-sans min-h-screen bg-[#141414] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={
                 user && !activeProfile ? <Profiles /> : 
                 <Home />
            } />
            <Route path="/browse" element={
                 <Navigate to="/" replace />
            } />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/products" element={<AdminAddProduct />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/vault" element={<Vault />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
