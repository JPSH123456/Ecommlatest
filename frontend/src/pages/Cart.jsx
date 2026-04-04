import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import api from '../api/axios';

export default function Cart() {
  const { cart, fetchCart } = useStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    setTotal(cart.reduce((acc, item) => acc + (100 * item.quantity), 0)); 
  }, [cart]);

  const handleRemove = async (id) => {
      await api.delete(`/cart/cart/${id}`);
      fetchCart();
  };

  const checkout = async () => {
      try {
          const res = await api.post('/order/orders', {
              total_amount: total,
              items: cart.map(c => ({ product_id: c.product_id, quantity: c.quantity, price: 100 }))
          });
          const order_id = res.data.id;
          await api.post('/payment/payments', { order_id, amount: total });
          await api.delete('/cart/cart');
          fetchCart();
          alert('Order placed successfully!');
      } catch (e) {
          console.error(e);
          alert('Checkout failed');
      }
  }

  return (
    <div className="bg-[#141414] min-h-screen p-10 max-w-screen-2xl mx-auto flex flex-col md:flex-row text-white mt-16">
      <div className="flex-grow m-5 shadow-lg bg-black/80 rounded border border-zinc-800 p-8">
        <h1 className="text-3xl border-b border-zinc-700 pb-4 mb-6 font-extrabold tracking-wide">Shopping Cart</h1>
        {cart.length === 0 ? (
           <p className="text-gray-400 text-lg">Your cart is empty.</p>
        ) : (
           cart.map((item, i) => (
             <div key={i} className="flex justify-between items-center py-6 border-b border-zinc-800">
                 <div className="flex gap-6 items-center">
                     <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="product" className="h-24 w-16 object-contain drop-shadow-md"/>
                     <div>
                         <p className="font-bold text-xl drop-shadow-md">Product ID: {item.product_id}</p>
                         <p className="text-sm text-green-500 font-bold tracking-wide mt-1">Available to Stream / Buy</p>
                         <p className="text-sm text-gray-400 mt-1">Quantity: {item.quantity}</p>
                     </div>
                 </div>
                 <div className="flex flex-col items-end">
                     <p className="font-extrabold text-2xl text-red-500 mb-2">$100.00</p>
                     <button onClick={() => handleRemove(item.id)} className="text-sm font-semibold text-gray-400 hover:text-red-500 transition border border-transparent hover:border-red-500 px-3 py-1 rounded">Remove</button>
                 </div>
             </div>
           ))
        )}
      </div>

      <div className="flex flex-col bg-black/80 rounded border border-zinc-800 p-8 shadow-lg m-5 min-w-[300px] h-min">
          <h2 className="whitespace-nowrap font-medium text-lg text-gray-300">
             Subtotal ({cart.length} items): <span className="font-bold text-white text-2xl drop-shadow-md ml-2">${total.toFixed(2)}</span>
          </h2>
          <button 
             onClick={checkout}
             disabled={cart.length === 0}
             className={`button mt-6 bg-red-600 py-3 shadow-md rounded-md w-full text-base font-bold text-white hover:bg-red-700 transition duration-300 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
             Proceed to Checkout
          </button>
      </div>
    </div>
  );
}
