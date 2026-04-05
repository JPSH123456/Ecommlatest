import React, { useState } from 'react';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useStore((state) => state.addToCart);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product.id, 1);
  };

  const fallbackVideos = [
    'YyepU5ztLf4', 'bjZp5amBugs', '7kJ6kQznl20', 'brzZcEZGN1Y', 'uIzx7VkrSWE', // Old trending
    'kPmAJPUVY8I', 'F9Aha2-uTso', 'dHsV56I1GwE', 'Tnfs0MZsBBE',                 // New additions
    'IvAi9-yh8oA', 'nWqZEcRvhXs', 'SeC7DdD0bU8'                                // Final additions (12 total)
  ];
  const videoId = product.video_url || fallbackVideos[parseInt(product.id || 0) % fallbackVideos.length];

  return (
    <div 
      className="bg-[#141414] relative z-30 w-[280px] h-[160px] cursor-pointer hover:scale-110 hover:z-50 transition-all duration-300 rounded-md overflow-hidden group shadow-lg" 
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
         <iframe 
           src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=0&loop=1&playlist=${videoId}&iv_load_policy=3&disablekb=1&fs=0`}
           allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
           className="absolute inset-0 w-full h-full z-0 pointer-events-none scale-[1.15]" 
           frameBorder="0"
         />
      ) : (
         <img 
           src={product.image_url || 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=500&q=80'} 
           alt={product.name} 
           className="absolute inset-0 w-full h-full object-cover z-0" 
         />
      )}
      
      {/* Title display when NOT hovered */}
      <div className="absolute inset-0 bg-gradient-to-t from-black flex items-end p-2 z-10 transition-opacity duration-300 group-hover:opacity-0">
          <span className="font-bold text-white text-sm drop-shadow-md">{product.name}</span>
      </div>

      {/* Hover Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h4 className="font-bold text-white text-sm line-clamp-1 leading-tight">{product.name}</h4>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="font-extrabold text-green-500 text-xs text-shadow">98% Match</span>
          <span className="border border-gray-500 text-gray-300 text-[10px] px-1 bg-black/50">${product.price}</span>
          <span className="text-gray-300 text-xs italic">{product.category || 'Action'}</span>
        </div>
        
        <div className="flex gap-2 w-full mt-2">
            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 if(!user) navigate('/login');
                 else alert("Playing trailer...");
              }}
              className="flex-1 bg-white text-black py-1 rounded-sm font-bold text-xs hover:bg-gray-200 transition flex items-center justify-center gap-1"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                 Play
            </button>
            <button 
              onClick={handleAddToCart} 
              className="flex-1 bg-red-600 text-white py-1 rounded-sm font-bold text-xs hover:bg-red-700 transition"
            >
              Add
            </button>
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                if(!user) return navigate('/login');
                try {
                  await api.post('/wishlist/wishlist', { product_id: product.id });
                  alert('Added to wishlist!');
                } catch(err) {} 
              }} 
              className="bg-zinc-800 text-white w-7 flex items-center justify-center rounded-full hover:bg-zinc-600 border border-zinc-600 transition"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>            
            </button>
        </div>
      </div>
    </div>
  );
}
