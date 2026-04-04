import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import useStore from '../store/useStore';

export default function Navbar() {
  const { user, cartCount, logout, fetchCart } = useStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 text-white flex flex-col sm:flex-row items-center justify-between p-4 sm:px-12 transition-all duration-500 ${isScrolled ? 'bg-[#141414] shadow-2xl shadow-black/50' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'}`}>
      {/* Brand */}
      <Link to="/" className="text-3xl font-extrabold text-[#E50914] tracking-wider p-2 cursor-pointer drop-shadow-[0_2px_4px_rgba(229,9,20,0.4)] hover:scale-105 transition-transform">
        STREAM<span className="text-white">SHOP</span>
      </Link>
      
      {/* Search Bar */}
      <div className="flex flex-1 max-w-md mx-8 my-2 sm:my-0 items-center bg-black/30 border border-neutral-700 rounded overflow-hidden backdrop-blur-xl transition-all duration-300 hover:bg-black/50 focus-within:border-white focus-within:ring-1 focus-within:ring-white">
        <button className="p-2 text-neutral-400 hover:text-white h-10 w-12 flex justify-center items-center transition-colors">
          <Search size={20} />
        </button>
        <input 
          type="text" 
          className="p-2 flex-grow text-white bg-transparent outline-none h-10 px-2 placeholder-neutral-500 font-medium tracking-wide" 
          placeholder="Titles, products, categories"
        />
      </div>

      {/* Nav Links */}
      <div className="flex items-center space-x-6 text-sm font-semibold tracking-wide">
        {user ? (
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="text-neutral-300 hover:text-white transition-colors duration-300">
              Profile
            </Link>

            <Link to="/wallet" className="text-neutral-300 hover:text-white transition-colors duration-300">
              Wallet
            </Link>

            <Link to="/admin/products" className="text-neutral-300 hover:text-white transition-colors duration-300">
              Admin
            </Link>
            
            <Link to="/orders" className="text-neutral-300 hover:text-white transition-colors duration-300">
              Orders
            </Link>

            <Link to="/wishlist" className="text-neutral-300 hover:text-[#E50914] hover:scale-110 transition-all duration-300">
              <Heart size={20} />
            </Link>

            <div className="text-neutral-300 hover:text-white transition-colors duration-300 cursor-pointer" onClick={handleLogout}>
              Sign Out
            </div>
          </div>
        ) : (
          <Link to="/login" className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            Sign In
          </Link>
        )}

        <Link to="/cart" className="flex items-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer relative group">
          <div className="relative transform group-hover:scale-110 transition-transform">
             <ShoppingCart size={24} />
             {cartCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-[#E50914] text-white font-black h-5 w-5 flex items-center justify-center rounded-full text-[10px] shadow-lg">
                 {cartCount}
               </span>
             )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
