import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/payment/wallet/balance');
      setBalance(res.data.balance);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
      console.error('Wallet fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payment/wallet/deposit', { amount: parseFloat(depositAmount) });
      setDepositAmount('');
      fetchWallet();
    } catch (err) {
      console.error('Deposit error:', err);
      alert('Failed to deposit funds');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Wallet...</div>;

  return (
    <div className="flex justify-center items-center py-20 bg-[#141414] min-h-screen">
      <div className="bg-black/80 p-8 rounded-md shadow-2xl border border-zinc-800 w-full max-w-md h-min text-white">
        <h2 className="text-3xl font-extrabold mb-6">Account Balance</h2>
        
        <div className="bg-gradient-to-br from-red-900 to-black text-white rounded-md p-8 mb-8 text-center shadow-lg border border-red-800/50">
          <p className="text-sm text-gray-300 tracking-wider mb-2">AVAILABLE CREDIT</p>
          <h1 className="text-5xl font-black">${balance.toFixed(2)}</h1>
        </div>

        <form onSubmit={handleDeposit} className="border-t border-zinc-800 pt-6">
          <h3 className="font-semibold text-gray-300 mb-4">Add Funds to Account</h3>
          <div className="flex gap-2">
            <input 
              type="number" 
              step="0.01" 
              min="1"
              value={depositAmount} 
              onChange={e => setDepositAmount(e.target.value)} 
              placeholder="e.g. 100.00"
              className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded p-3 outline-none flex-1"
              required 
            />
            <button type="submit" className="bg-red-600 px-6 font-bold text-white rounded hover:bg-red-700 transition duration-300">
              Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
