import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="relative flex justify-center min-h-[calc(100vh-64px)] bg-black text-white overflow-hidden">
      {/* Background Image Collage */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl pt-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-wide">
          Unlimited movies, <br/>shows, and more
        </h1>
        <p className="text-lg sm:text-xl font-medium mb-8 drop-shadow-md">Starts at ₹149. Cancel at any time.</p>
        
        <p className="text-base font-normal mb-4 drop-shadow-md">Ready to watch? Enter your email to create or restart your membership.</p>
        
        <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row w-full max-w-2xl gap-2 justify-center">
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-4 w-full sm:w-2/3 bg-black/60 border border-gray-500 rounded text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              required
            />
            <button type="submit" className="px-6 py-4 w-full sm:w-1/3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded sm:text-xl transition flex items-center justify-center gap-2">
               Get Started
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </form>
      </div>
    </div>
  );
}
