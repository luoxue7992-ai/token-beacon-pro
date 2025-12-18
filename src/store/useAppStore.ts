import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InstitutionInfo, StablecoinProduct } from '@/types';
import { Language } from '@/i18n/translations';

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Onboarding
  isOnboarded: boolean;
  institutionInfo: InstitutionInfo | null;
  setOnboarded: (info: InstitutionInfo) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Current page
  currentPage: 'home' | 'product' | 'dashboard';
  setCurrentPage: (page: 'home' | 'product' | 'dashboard') => void;
  
  // Selected product
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  // Wallet
  connectedWallet: string | null;
  setConnectedWallet: (address: string | null) => void;
  
  // Chat
  isChatOpen: boolean;
  toggleChat: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language
      language: 'zh',
      setLanguage: (lang) => set({ language: lang }),
      
      // Onboarding
      isOnboarded: false,
      institutionInfo: null,
      setOnboarded: (info) => set({ isOnboarded: true, institutionInfo: info }),
      
      // Favorites
      favorites: [],
      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },
      isFavorite: (productId) => get().favorites.includes(productId),
      
      // Current page
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Selected product
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      
      // Wallet
      connectedWallet: null,
      setConnectedWallet: (address) => set({ connectedWallet: address }),
      
      // Chat
      isChatOpen: false,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    }),
    {
      name: 'stablecoin-invest-storage',
    }
  )
);
