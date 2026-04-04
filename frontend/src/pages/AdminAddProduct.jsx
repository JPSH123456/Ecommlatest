import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: ''
  });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await api.post('/product/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      setStatus('Product Add Successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus('Failed to add product.');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-[#141414] min-h-screen text-white">
      <div className="bg-black/80 p-8 rounded-md shadow-2xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6">Add New Title</h2>
        {status && <div className={`p-2 mb-4 rounded ${status.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{status}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Title Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none resize-none" rows="3" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-2 text-gray-400">Price ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-2 text-gray-400">Stock</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Category / Genre</label>
            <input required name="category" value={formData.category} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">Thumbnail Image URL</label>
            <input required type="url" name="image_url" value={formData.image_url} onChange={handleChange} className="bg-[#333] border border-transparent focus:border-white focus:bg-[#444] text-white transition rounded w-full p-3 outline-none" />
          </div>
          <button type="submit" className="bg-red-600 mt-6 font-bold text-white py-4 rounded hover:bg-red-700 transition duration-300">Publish Title</button>
        </form>
      </div>
    </div>
  );
}
