import React from 'react';
import useStore from '../store/useStore';

export default function Profiles() {
  const { profiles, setActiveProfile, addProfile } = useStore();

  const handleSelect = (profile) => {
    setActiveProfile(profile);
  };

  const handleAddProfile = () => {
    const name = prompt("Enter Profile Name:");
    if (name) {
      const isKids = window.confirm("Is this a Children's profile?");
      const seed = name.trim().replace(/\s+/g, '-');
      const newProfile = {
        name,
        isKids,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${isKids ? 'ffd5e5' : 'c1f0c1'}`
      };
      addProfile(newProfile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#141414] text-white p-4">
        <h1 className="text-4xl sm:text-5xl mb-12 font-bold tracking-tight">Who's watching?</h1>
        
        <div className="flex gap-6 sm:gap-10 flex-wrap justify-center mb-16 max-w-5xl">
            {profiles.map((p, idx) => (
                <div key={idx} onClick={() => handleSelect(p)} className="flex flex-col items-center gap-4 cursor-pointer group">
                    <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white group-hover:scale-105 transition-all duration-300 shadow-2xl">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        {p.isKids && (
                           <div className="absolute top-0 right-0 bg-[#E50914] text-white text-[10px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest shadow-lg">KIDS</div>
                        )}
                    </div>
                    <span className="text-gray-500 group-hover:text-white transition-colors text-lg font-medium">{p.name}</span>
                </div>
            ))}
            
            {/* Add Profile */}
            <div onClick={handleAddProfile} className="flex flex-col items-center gap-4 cursor-pointer group">
                 <div className="w-24 h-24 sm:w-40 sm:h-40 border-4 border-transparent flex items-center justify-center group-hover:bg-neutral-200 transition-all duration-300 group-hover:border-white rounded-lg bg-neutral-800 text-neutral-500 group-hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
                 </div>
                 <span className="text-gray-500 group-hover:text-white transition-colors text-lg font-medium">Add Profile</span>
            </div>
        </div>

        <button className="border border-gray-600 text-gray-600 py-3 px-10 uppercase tracking-[0.3em] font-bold text-xs hover:text-white hover:border-white hover:bg-white/5 transition-all duration-500">
             Manage Profiles
        </button>
    </div>
  );
}
