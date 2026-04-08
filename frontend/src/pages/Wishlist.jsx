import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist/wishlist');
      const items = res.data;
      
      const productPromises = items.map(item => api.get(`/product/products/${item.product_id}`));
      const productResponses = await Promise.all(productPromises);
      
      setWishlistProducts(productResponses.map(r => r.data));
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Wishlist...</div>;

  return (
    <div className="bg-[#141414] min-h-screen p-8 pt-24 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 drop-shadow-md">My List</h1>
        {wishlistProducts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-10 rounded shadow-md text-gray-400 text-center text-lg">
            You haven't added any titles to your list yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
