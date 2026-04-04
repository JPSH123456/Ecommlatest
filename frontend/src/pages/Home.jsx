import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const user = useStore(state => state.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback products so the UI can be demonstrated if the database is unseeded
  const DUMMY_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
      id: 9000 + i,
      name: `Cinematic Feature ${i+1}`,
      category: i < 6 ? 'Trending Now' : 'Exciting TV Shows',
      price: 19.99,
      image_url: `https://picsum.photos/seed/stream${i}/500/750` // Vertical poster aspect ratio
  }));

  useEffect(() => {
    api.get('/product/products').then(res => {
        setProducts(res.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] overflow-hidden">
       {/* Hero Section */}
       <div className="relative h-[85vh] w-full">
         <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-black/60 z-20" />
         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-20" />
         
         <video 
           className="absolute inset-0 w-full h-full object-cover z-10"
           autoPlay 
           loop 
           muted 
           playsInline
           poster="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
         >
           <source src="https://cdn.pixabay.com/video/2021/08/04/83864-584738596_large.mp4" type="video/mp4" />
         </video>

         <div className="absolute top-[35%] left-[4%] z-30 max-w-2xl transform transition-all duration-1000 translate-y-0 opacity-100">
            <div className="flex items-center gap-2 mb-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" className="h-6 filter brightness-0 invert sepia hue-rotate-[320deg] saturate-[5] contrast-[1.5]" style={{filter: 'invert(16%) sepia(87%) saturate(5833%) hue-rotate(352deg) brightness(97%) contrast(116%)'}} alt="N" />
                <h2 className="text-sm text-neutral-300 font-bold tracking-[0.25em] drop-shadow-md">S E R I E S</h2>
            </div>
            <h1 className="text-7xl font-black text-white drop-shadow-2xl mb-4 leading-[0.9] tracking-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>STRANGER<br/>THINGS</h1>
            <p className="text-xl text-white font-semibold drop-shadow-lg mb-6 max-w-xl line-clamp-3 text-neutral-200">
              When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => user ? alert("Feature Presentation Playing!") : navigate('/login')}
                className="bg-white text-black px-8 py-2.5 rounded font-bold hover:bg-neutral-300 transition-all duration-300 flex items-center gap-3 text-lg select-none transform hover:scale-105"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                 Play
              </button>
              <button className="bg-neutral-500/50 backdrop-blur-md text-white px-8 py-2.5 rounded font-bold hover:bg-neutral-500/70 transition-all duration-300 flex items-center gap-3 text-lg select-none transform hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                 More Info
              </button>
            </div>
         </div>
       </div>

       {/* Movie Rows */}
       <div className="z-30 relative -mt-32 pb-20 space-y-12">
         {!loading ? (
             Object.entries(
                 (products.length > 0 ? products : DUMMY_PRODUCTS).reduce((acc, p) => {
                     const cat = p.category || 'Trending Now';
                     acc[cat] = acc[cat] || [];
                     acc[cat].push(p);
                     return acc;
                 }, {
                    'Trending Now': (products.length > 0 ? products : DUMMY_PRODUCTS).slice(0, 6), 
                    'Exciting TV Shows': (products.length > 0 ? products : DUMMY_PRODUCTS).slice(6).length ? (products.length > 0 ? products : DUMMY_PRODUCTS).slice(6) : (products.length > 0 ? products : DUMMY_PRODUCTS)
                 })
             ).map(([category, items], rowIndex) => (
                 <div key={category} className="px-[4%] group">
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-200 mb-4 tracking-wide group-hover:text-white transition-colors">{category}</h2>
                    <div className="flex overflow-x-visible gap-2 md:gap-4 pb-8 pt-4 no-scrollbar snap-x relative z-30">
                         {items.map((product, idx) => (
                           <div className="min-w-[160px] md:min-w-[240px] snap-start relative transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:z-50 cursor-pointer" key={product.id + category + idx}>
                              {rowIndex === 0 && (
                                  <div className="absolute -top-3 -right-3 z-40 bg-[#E50914] text-white font-black text-[10px] px-2 py-1.5 rounded shadow-[0_0_10px_rgba(229,9,20,0.6)] border border-red-400/30 flex flex-col items-center">
                                      <span className="leading-none text-white/90">TOP</span>
                                      <span className="text-lg leading-none mt-0.5">10</span>
                                  </div>
                              )}
                              <div className="rounded-md overflow-hidden shadow-lg border border-transparent hover:border-neutral-600 transition-colors bg-neutral-800">
                                <ProductCard product={product} index={idx} />
                              </div>
                           </div>
                         ))}
                    </div>
                 </div>
             ))
         ) : (
           <div className="px-[4%]">
              <h2 className="text-2xl font-bold mb-4 bg-neutral-800 w-48 h-8 rounded animate-pulse"></h2>
              <div className="flex gap-4 pb-4 overflow-hidden">
                 {Array(6).fill().map((_, i) => (
                   <div key={i} className="min-w-[160px] md:min-w-[240px] bg-neutral-800 animate-pulse h-64 md:h-96 rounded-md shadow-lg border border-neutral-800">
                   </div>
                 ))}
              </div>
           </div>
         )}
       </div>
    </div>
  );
}
