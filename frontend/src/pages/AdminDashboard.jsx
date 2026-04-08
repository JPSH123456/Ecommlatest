import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthorized) {
      fetchData(activeTab);
    }
  }, [activeTab, isAuthorized]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const securePin = import.meta.env.VITE_ADMIN_PIN || '525127948'; 
    if (pin === securePin) {
      setIsAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'users') {
        try {
          const res = await api.get('/auth/admin/users');
          setUsers(res.data);
        } catch (err) {
          setUsers([
            { id: 1, full_name: "Puneet Sharma", email: "puneet@example.com", hashed_password: "$2b$12$KSD932...KSD", role: "admin" },
            { id: 2, full_name: "John Doe", email: "john@example.com", hashed_password: "$2b$12$93KS...93KS", role: "user" },
            { id: 3, full_name: "Jane Smith", email: "jane@example.com", hashed_password: "$2b$12$KS93...KS92", role: "user" }
          ]);
        }
      } else if (tab === 'orders') {
        const res = await api.get('/order/admin/orders');
        setOrders(res.data);
      } else if (tab === 'products') {
        const res = await api.get('/product/products');
        setProducts(res.data);
      } else if (tab === 'activity') {
        const res = await api.get('/admin/audit-logs');
        setAuditLogs(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black">
        <div className="max-w-md w-full p-10 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(229,9,20,0.1)] text-center relative overflow-hidden group">
          {/* Abstract Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-[80px] group-hover:bg-red-600/30 transition-all duration-700"></div>
          
          <div className="mb-8 relative inline-block">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/30 shadow-[0_0_30px_rgba(229,9,20,0.2)] animate-pulse">
              <Lock className="text-[#E50914]" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">ADMIN ACCESS</h1>
          <p className="text-[#E50914] font-bold text-lg mb-8 uppercase tracking-widest animate-bounce">
            aise kaise ghusega :) naam bta
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors" size={18} />
              <input 
                type="password"
                placeholder="Enter Admin PIN"
                className={`w-full bg-black/40 border ${pinError ? 'border-red-600 shadow-[0_0_15px_rgba(229,9,20,0.3)]' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-red-600 transition-all text-xl tracking-[0.5em] font-mono text-center`}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            
            {pinError && (
              <p className="text-red-500 text-sm font-bold flex items-center justify-center gap-2">
                <ShieldAlert size={14} /> Incorrect PIN. Access Denied.
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] active:scale-95 uppercase tracking-widest"
            >
              Verify Identity
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              Authorized Personnel Only | System Trace Active
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'System Users' },
    { id: 'orders', label: 'All Orders' },
    { id: 'products', label: 'Products Inventory' },
    { id: 'activity', label: 'User Activity Trace' }
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 pt-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Database Viewer & Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-800 mb-6 font-semibold uppercase tracking-widest text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 transition-all relative ${
              activeTab === tab.id ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E50914] shadow-[0_0_10px_#E50914]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-40">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-[#E50914] rounded-full animate-spin shadow-[0_0_30px_rgba(229,9,20,0.2)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-500 p-8 rounded-3xl border border-red-900/50 text-center font-bold tracking-widest uppercase">
          {error}
        </div>
      ) : (
        <div className="bg-[#0c0c0c] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#111] text-[10px] uppercase font-black text-gray-500 border-b border-white/5 tracking-[0.1em]">
                {activeTab === 'users' && (
                  <tr>
                    <th className="px-8 py-5">ID</th>
                    <th className="px-8 py-5">Full Name</th>
                    <th className="px-8 py-5">Email</th>
                    <th className="px-8 py-5">Hashed Password</th>
                    <th className="px-8 py-5">Role</th>
                  </tr>
                )}
                {activeTab === 'orders' && (
                  <tr>
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">User ID</th>
                    <th className="px-8 py-5">Total Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Items Count</th>
                  </tr>
                )}
                {activeTab === 'products' && (
                  <tr>
                    <th className="px-8 py-5">ID</th>
                    <th className="px-8 py-5">Product Name</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Stock</th>
                  </tr>
                )}
                {activeTab === 'activity' && (
                  <tr>
                    <th className="px-8 py-5">Time</th>
                    <th className="px-8 py-5">User</th>
                    <th className="px-8 py-5">IP Address</th>
                    <th className="px-8 py-5">Method/Service</th>
                    <th className="px-8 py-5">Path</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeTab === 'users' && users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-4 font-mono text-gray-600">{u.id}</td>
                    <td className="px-8 py-4 font-bold text-white tracking-wide">{u.full_name || 'N/A'}</td>
                    <td className="px-8 py-4 font-medium text-gray-400 group-hover:text-[#E50914] transition-colors">{u.email}</td>
                    <td className="px-8 py-4 font-mono text-[10px] text-gray-600 truncate max-w-[150px]">{u.hashed_password}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-900/40 text-[#E50914] border border-red-900' : 'bg-gray-800 text-gray-400'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'orders' && orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 font-mono text-blue-500">#{o.id}</td>
                    <td className="px-8 py-4 text-gray-500">User {o.user_id}</td>
                    <td className="px-8 py-4 font-bold text-white">${o.total_amount?.toFixed(2)}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${o.status === 'completed' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-gray-500 font-bold">{o.items?.length || 0} ITEMS</td>
                  </tr>
                ))}

                {activeTab === 'products' && products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 font-mono text-gray-600">{p.id}</td>
                    <td className="px-8 py-4 font-bold text-white flex items-center gap-4">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-gray-900 border border-white/5" />}
                      <span className="truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="px-8 py-4 text-gray-500 uppercase text-xs font-bold">{p.category}</td>
                    <td className="px-8 py-4 font-black text-white text-lg">${p.price?.toFixed(2)}</td>
                    <td className="px-8 py-4">
                      <span className={`font-black ${p.stock_quantity > 10 ? 'text-green-500' : p.stock_quantity > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                  </tr>
                ))}

                {activeTab === 'activity' && auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="px-8 py-4 text-gray-600 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-8 py-4 font-black text-white text-xs">{log.user_email || 'ANONYMOUS'}</td>
                    <td className="px-8 py-4 font-mono text-[10px] text-blue-400/70">{log.ip_address}</td>
                    <td className="px-8 py-4">
                      <span className="text-white font-black text-xs">{log.method}</span>
                      <span className="ml-2 text-gray-600 font-bold uppercase text-[9px]">[{log.service_name}]</span>
                    </td>
                    <td className="px-8 py-4 font-mono text-[10px] text-gray-600 max-w-[200px] truncate">
                      {log.path}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${log.status_code < 400 ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
                        {log.status_code}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Empty States */}
                {activeTab === 'users' && users.length === 0 && (
                  <tr><td colSpan="3" className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em]">No access records.</td></tr>
                )}
                {activeTab === 'orders' && orders.length === 0 && (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em]">No system orders.</td></tr>
                )}
                {activeTab === 'products' && products.length === 0 && (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em]">Inventory empty.</td></tr>
                )}
                {activeTab === 'activity' && auditLogs.length === 0 && (
                  <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em]">Trace log clear.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
