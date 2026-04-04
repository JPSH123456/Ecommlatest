import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useStore from '../store/useStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const idx = parseInt(id) || 0;
      let prodRes = null;
      let revRes = null;
      
      try {
          prodRes = await api.get(`/product/products/${id}`);
      } catch (err) {
          // Intercept 404s for DUMMY_PRODUCTS so the UI continues working!
          if (idx >= 9000) {
              prodRes = { data: {
                  id: idx,
                  name: `Cinematic Feature ${idx - 8999}`,
                  category: "Netflix Selection",
                  price: 19.99,
                  stock: 120,
                  description: "A spectacular, action-packed feature presentation. The best in entertainment.",
                  image_url: `https://images.unsplash.com/photo-${1500000000000 + ((idx-9000) * 12345678)}?auto=format&fit=crop&w=500&q=80`
              }};
          } else throw err;
      }

      try {
          revRes = await api.get(`/review/reviews/product/${id}`);
      } catch(err) { revRes = { data: [] }; }

      setProduct(prodRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error("Failed to fetch details", err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post('/review/reviews', {
        product_id: parseInt(id),
        rating: rating,
        comment: newReviewText
      });
      setNewReviewText('');
      fetchData(); // reload reviews
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#141414] text-white flex justify-center items-center">Loading feature...</div>;
  if (!product) return <div className="min-h-screen bg-[#141414] text-white flex justify-center items-center">Title not found.</div>;

  return (
    <div className="bg-[#141414] min-h-screen text-white pt-16">
       {/* Cinematic Player Section */}
       <div className="w-full bg-black aspect-video relative shadow-2xl border-b border-zinc-800">
           {user ? (
               <iframe 
                 className="w-full h-full"
                 src={`https://www.youtube.com/embed/${['YyepU5ztLf4', 'bjZp5amBugs', '7kJ6kQznl20', 'brzZcEZGN1Y', 'uIzx7VkrSWE'][parseInt(id || 0) % 5] || 'sY1S34973ZI'}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0`} 
                 title="YouTube video player" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               />
           ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border-b border-zinc-800 p-8 text-center">
                  <h2 className="text-3xl font-extrabold mb-4">Authentication Required</h2>
                  <p className="text-gray-400 mb-6">You must be logged in to watch feature presentations and trailers.</p>
                  <button onClick={() => navigate('/login')} className="bg-red-600 px-8 py-3 rounded font-bold hover:bg-red-700 transition">Sign In to Play</button>
               </div>
           )}
       </div>

       {/* Movie / Product Details */}
       <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Main Info */}
            <div className="md:col-span-2">
                <h1 className="text-5xl font-black mb-4 drop-shadow-lg">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-green-500 font-bold text-lg">98% Match</span>
                    <span className="border border-gray-600 px-2 text-sm text-gray-300">HD / 4K</span>
                    <span className="text-gray-300 italic">{product.category || 'Trending'}</span>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">{product.description}</p>
                <div className="mt-8">
                    <button className="bg-white text-black font-bold px-8 py-3 rounded flex items-center gap-2 hover:bg-gray-200 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                         Play Full Title
                    </button>
                </div>
                
                {/* Reviews Section */}
                <div className="mt-16 border-t border-zinc-800 pt-10">
                    <h3 className="text-2xl font-bold mb-6">User Reviews & Ratings</h3>
                    
                    {/* Add Review */}
                    <form onSubmit={submitReview} className="mb-10 bg-black/60 border border-zinc-800 p-6 rounded">
                        <h4 className="font-semibold mb-4 text-gray-300">Rate this title</h4>
                        <div className="flex gap-4 mb-4">
                            <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="bg-[#333] border-none rounded p-2 text-white outline-none">
                                <option value={5}>5 Stars - Masterpiece</option>
                                <option value={4}>4 Stars - Great</option>
                                <option value={3}>3 Stars - Good</option>
                                <option value={2}>2 Stars - Mediocre</option>
                                <option value={1}>1 Star - Terrible</option>
                            </select>
                            <input 
                              required
                              type="text" 
                              value={newReviewText} 
                              onChange={e => setNewReviewText(e.target.value)}
                              placeholder="Write your review..."
                              className="bg-[#333] flex-1 rounded p-2 text-white outline-none focus:bg-[#444]"
                            />
                            <button className="bg-red-600 text-white px-6 font-bold rounded hover:bg-red-700 transition">Post</button>
                        </div>
                    </form>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((rev, i) => (
                                <div key={i} className="border-b border-zinc-800 pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-zinc-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-gray-400">U{rev.user_id}</div>
                                        <span className="text-red-500 font-black">{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</span>
                                    </div>
                                    <p className="text-gray-300">"{rev.comment}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar / Buy Box */}
            <div className="bg-black/80 border border-zinc-800 p-8 rounded h-min shadow-xl flex flex-col">
                <img className="w-full object-cover rounded shadow-md border border-zinc-700 mb-6 drop-shadow-2xl" src={product.image_url || 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=500&q=80'} alt={product.name} />
                <h4 className="font-extrabold text-3xl text-red-500 mb-2">${product.price}</h4>
                <p className="text-sm text-gray-400 mb-6">{product.stock} copies remaining</p>
                
                <button 
                  onClick={async () => {
                      if (!user) return navigate('/login');
                      await api.post('/cart/cart', { product_id: product.id, quantity: 1 });
                      alert('Added to Cart!');
                  }}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition shadow-lg mb-4"
                >
                  Add to Cart
                </button>

                <button 
                  onClick={async () => {
                      if (!user) return navigate('/login');
                      await api.post('/wishlist/wishlist', { product_id: product.id });
                      alert('Added to My List!');
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white font-bold py-3 rounded hover:bg-zinc-700 transition"
                >
                  + My List
                </button>
            </div>

       </div>
    </div>
  );
}
