import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set) => ({
  user: null,
  activeProfile: null,
  cart: [],
  cartCount: 0,
  
  setUser: (user) => set({ user }),
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, activeProfile: null, cart: [], cartCount: 0 });
  },

  fetchCart: async () => {
    try {
      const res = await api.get('/cart/cart');
      const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
      set({ cart: res.data, cartCount: count });
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  },
  
  addToCart: async (productId, quantity = 1) => {
    try {
      await api.post('/cart/cart', { product_id: productId, quantity });
      // refetch cart to keep in sync
      const res = await api.get('/cart/cart');
      const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
      set({ cart: res.data, cartCount: count });
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  }
}));

export default useStore;
