import React from 'react';
import useStore from '../store/useStore';

export default function Profiles() {
  const setActiveProfile = useStore(state => state.setActiveProfile);

  const profiles = [
    { name: 'Puneet Sharma', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Puneet&backgroundColor=b6e3f4' },
    { name: 'Puneet', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sharma&backgroundColor=ffdfbf' },
    { name: 'Children', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kids&backgroundColor=c0aede' }
  ];

  const handleSelect = (profile) => {
    setActiveProfile(profile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#141414] text-white">
        <h1 className="text-4xl sm:text-5xl mb-8 font-medium">Who's watching?</h1>
        
        <div className="flex gap-4 sm:gap-8 flex-wrap justify-center mb-16">
            {profiles.map((p, idx) => (
                <div key={idx} onClick={() => handleSelect(p)} className="flex flex-col items-center gap-4 cursor-pointer group">
                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded overflow-hidden border-2 border-transparent group-hover:border-white transition">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition">{p.name}</span>
                </div>
            ))}
            
            {/* Add Profile */}
            <div className="flex flex-col items-center gap-4 cursor-pointer group">
                 <div className="w-24 h-24 sm:w-36 sm:h-36 rounded overflow-hidden border-2 border-transparent flex items-center justify-center hover:bg-gray-200 transition group-hover:border-white group-hover:bg-white group-hover:text-black text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
                 </div>
                 <span className="text-gray-400 group-hover:text-white transition">Add Profile</span>
            </div>
        </div>

        <button className="border border-gray-500 text-gray-500 py-2 px-6 uppercase tracking-widest hover:text-white hover:border-white transition">
             Manage Profiles
        </button>
    </div>
  );
}
