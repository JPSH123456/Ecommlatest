import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/order/orders').then(res => {
        setOrders(res.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-12">
      <div className="max-w-screen-lg mx-auto px-6 h-full">
        <h1 className="text-4xl border-b border-zinc-800 mb-8 pb-4 font-extrabold tracking-wide drop-shadow-md">Purchase History</h1>
        
        {loading ? (
            <p className="animate-pulse text-lg text-gray-400">Loading history...</p>
        ) : orders.length === 0 ? (
            <p className="text-lg text-gray-400 bg-black/60 p-8 rounded border border-zinc-800">You haven't placed any orders yet.</p>
        ) : (
            <div className="space-y-8">
                {orders.map(order => (
                    <div key={order.id} className="border border-zinc-800 rounded bg-black/80 shadow-xl overflow-hidden">
                        <div className="bg-black p-5 border-b border-zinc-800 flex justify-between items-center text-sm text-gray-400">
                            <div>
                                <p className="uppercase font-bold text-gray-500 tracking-wider text-xs mb-1">Order Placed</p>
                                <p className="font-semibold text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="uppercase font-bold text-gray-500 tracking-wider text-xs mb-1">Total</p>
                                <p className="font-semibold text-white">${order.total_amount.toFixed(2)}</p>
                            </div>
                            <div className="text-right flex-1 sm:flex-none">
                                <p className="uppercase font-bold text-gray-500 tracking-wider text-xs mb-1">Order # {order.id}</p>
                                <p className="text-red-500 hover:text-red-400 font-semibold cursor-pointer transition">View Details</p>
                            </div>
                        </div>
                        
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">{order.status}</h3>
                            <div className="space-y-6">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex space-x-6 items-center">
                                        <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" className="h-24 sm:h-32 object-contain drop-shadow-md" alt="" />
                                        <div>
                                            <p className="font-bold sm:text-xl text-white mb-1">Product ID: {item.product_id}</p>
                                            <p className="text-sm text-gray-400 mb-3">Quantity: {item.quantity}</p>
                                            <button className="bg-white text-black py-2 px-6 font-bold text-sm rounded shadow hover:bg-gray-200 transition">Watch Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
