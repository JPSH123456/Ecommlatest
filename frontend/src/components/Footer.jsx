import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#141414] border-t border-gray-800 py-10 px-4 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="mb-4 md:mb-0">
          <h2 className="text-red-600 font-bold text-2xl tracking-tighter mb-2">STREAM SHOP</h2>
          <p>© 2026 Puneet Kumar. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-600 italic">Production Grade Microservices Architecture</p>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Help Center</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 border-t border-gray-900 pt-4 flex justify-center">
        <p className="text-[10px] text-gray-700 tracking-widest uppercase">
          Crafted with ❤️ by Puneet Kumar for the Cloud Native World
        </p>
      </div>
    </footer>
  );
};

export default Footer;
