import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        phone: res.data.phone || '',
        address: res.data.address || ''
      });
    } catch (err) {
      if(err.response?.status !== 404) {
        console.error('Fetch profile err:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Updating...');
    try {
      await api.post('/user/profile', profile);
      setStatus('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="flex justify-center items-center py-20 bg-[#141414] min-h-screen">
      <div className="bg-black/80 p-8 rounded-md shadow-2xl border border-zinc-800 w-full max-w-lg h-min text-white">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        {status && <div className={`p-2 mb-4 rounded ${status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{status}</div>}
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-2 text-gray-400">First Name</label>
              <input value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-2 text-gray-400">Last Name</label>
              <input value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Phone Number</label>
            <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Billing Address</label>
            <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none resize-none" rows="3" />
          </div>
          <button type="submit" className="bg-red-600 mt-6 font-bold text-white py-3 rounded hover:bg-red-700 transition">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
