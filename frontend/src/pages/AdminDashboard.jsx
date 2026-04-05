import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'users') {
        const res = await api.get('/auth/admin/users');
        setUsers(res.data);
      } else if (tab === 'orders') {
        const res = await api.get('/order/admin/orders');
        setOrders(res.data);
      } else if (tab === 'products') {
        const res = await api.get('/product/products');
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'System Users' },
    { id: 'orders', label: 'All Orders' },
    { id: 'products', label: 'Products Inventory' }
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
      <div className="flex space-x-1 border-b border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#E50914] rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#E50914] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-500 p-4 rounded-md border border-red-900/50">
          {error}
        </div>
      ) : (
        <div className="bg-[#181818] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#222] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                {activeTab === 'users' && (
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                )}
                {activeTab === 'orders' && (
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Items Count</th>
                  </tr>
                )}
                {activeTab === 'products' && (
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-800">
                {activeTab === 'users' && users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4">{u.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-[#E50914]/20 text-[#E50914]' : 'bg-gray-700 text-gray-300'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'orders' && orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 font-mono">#{o.id}</td>
                    <td className="px-6 py-4 text-gray-400">User {o.user_id}</td>
                    <td className="px-6 py-4 font-medium text-white">${o.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${o.status === 'completed' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{o.items?.length || 0} items</td>
                  </tr>
                ))}

                {activeTab === 'products' && products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4">{p.id}</td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-800" />}
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{p.category}</td>
                    <td className="px-6 py-4 font-medium">${p.price?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`${p.stock_quantity > 10 ? 'text-green-400' : p.stock_quantity > 0 ? 'text-yellow-400' : 'text-red-500'}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Empty States */}
                {activeTab === 'users' && users.length === 0 && (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
                )}
                {activeTab === 'orders' && orders.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
                )}
                {activeTab === 'products' && products.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
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
