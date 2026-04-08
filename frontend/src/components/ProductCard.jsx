import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  
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

  const videoId = product.youtube_id || 'YyepU5ztLf4';

  useEffect(() => {
    let timeout;
    if (isHovered) {
      timeout = setTimeout(() => setShouldPlay(true), 600);
    } else {
      setShouldPlay(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Base Card */}
      <div className={`relative transition-all duration-300 ease-out h-full w-full rounded-md overflow-hidden bg-zinc-900 border border-transparent shadow-lg
        ${isHovered ? 'scale-125 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-zinc-700' : 'scale-100 z-10'}
      `}>
        
        {/* Media Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-black">
            {shouldPlay ? (
               <iframe 
                 src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=5&loop=1&playlist=${videoId}&iv_load_policy=3&rel=0&modestbranding=1`}
                 allow="autoplay; encrypted-media"
                 className="absolute inset-0 w-full h-full scale-[1.3] pointer-events-none" 
                 frameBorder="0"
               />
            ) : (
               <img 
                 src={product.image_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                 alt={product.name} 
                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" 
               />
            )}
            
            {/* Gradient Overlay when NOT hovered */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
        </div>

        {/* Hover Info Section */}
        <div className={`absolute bottom-0 left-0 right-0 bg-zinc-900 p-3 transition-all duration-300 transform rounded-b-md
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}>
          <div className="flex gap-2 items-center mb-3">
             <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                className="h-8 w-8 rounded-full bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center active:scale-90 shadow-md"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
             </button>
             <button 
                onClick={handleAddToCart}
                className="h-8 w-8 rounded-full border-2 border-zinc-500 text-white hover:border-white transition flex items-center justify-center bg-transparent active:scale-95"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="h-8 w-8 rounded-full border-2 border-zinc-500 text-white hover:border-white transition flex items-center justify-center bg-transparent active:scale-95"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
             </button>
             <button className="h-8 w-8 rounded-full border-2 border-zinc-500 text-white hover:border-white transition flex items-center justify-center bg-transparent ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
             </button>
          </div>
          
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-xs uppercase">98% Match</span>
                <span className="text-zinc-400 text-[10px] border border-zinc-700 px-1 rounded">16+</span>
                <span className="text-zinc-400 text-[10px]">2h 15m</span>
             </div>
             <p className="text-white font-bold text-sm tracking-tight truncate">{product.name}</p>
          </div>
        </div>

        {/* Static Title (Visible when NOT hovered) */}
        <div className={`absolute bottom-3 left-3 right-3 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <p className="text-white font-bold text-sm drop-shadow-md truncate">{product.name}</p>
        </div>
      </div>
    </div>
  );
}
