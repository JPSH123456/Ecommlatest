import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set) => ({
  user: null,
  activeProfile: null,
  profiles: [
    { name: 'Puneet Sharma', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Puneet&backgroundColor=b6e3f4', isKids: false },
    { name: 'Children', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kids&backgroundColor=c0aede', isKids: true }
  ],
  cart: [],
  cartCount: 0,
  
  setUser: (user) => set({ user }),
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  addProfile: (newProfile) => set((state) => ({ profiles: [...state.profiles, newProfile] })),
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
