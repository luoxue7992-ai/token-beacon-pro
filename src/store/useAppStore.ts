import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InstitutionInfo, ConnectedWallet, DashboardAsset, AssetCategory } from '@/types';
import { Language } from '@/i18n/translations';

// Mock assets generator
const generateMockAssets = (walletId: string): DashboardAsset[] => [
  { token: "USDY", balance: 125000, value: 130421.25, price: 1.0434, apy7d: 5.25, profit: 5421.25, chain: "Ethereum", walletId, category: 'tokenised_mmf' },
  { token: "BUIDL", balance: 500000, value: 500000, price: 1.0, apy7d: 4.89, profit: 12450.00, chain: "Ethereum", walletId, category: 'tokenised_mmf' },
  { token: "PAXG", balance: 15.5, value: 40235.50, price: 2596.16, apy7d: 0, profit: 2235.50, chain: "Ethereum", walletId, category: 'tokenised_gold' },
  { token: "XAUT", balance: 8.2, value: 21288.40, price: 2596.15, apy7d: 0, profit: 1288.40, chain: "Ethereum", walletId, category: 'tokenised_gold' },
  { token: "ETH", balance: 25.8, value: 96750.00, price: 3750.00, apy7d: 3.2, profit: 8750.00, chain: "Ethereum", walletId, category: 'crypto' },
  { token: "BTC", balance: 1.25, value: 131250.00, price: 105000.00, apy7d: 0, profit: 21250.00, chain: "Bitcoin", walletId, category: 'crypto' },
  { token: "USDC", balance: 85000, value: 85000, price: 1.0, apy7d: 0, profit: 0, chain: "Ethereum", walletId, category: 'stablecoin' },
  { token: "USDT", balance: 50000, value: 50000, price: 1.0, apy7d: 0, profit: 0, chain: "BSC", walletId, category: 'stablecoin' },
];

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
  
  // Wallet (legacy)
  connectedWallet: string | null;
  setConnectedWallet: (address: string | null) => void;
  
  // Chat
  isChatOpen: boolean;
  toggleChat: () => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Dashboard Wallets & Assets
  dashboardWallets: ConnectedWallet[];
  dashboardAssets: DashboardAsset[];
  addDashboardWallet: (wallet: Omit<ConnectedWallet, 'id'>) => void;
  removeDashboardWallet: (walletId: string) => void;
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
      
      // Wallet (legacy)
      connectedWallet: null,
      setConnectedWallet: (address) => set({ connectedWallet: address }),
      
      // Chat
      isChatOpen: false,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Dashboard Wallets & Assets
      dashboardWallets: [],
      dashboardAssets: [],
      addDashboardWallet: (wallet) => {
        const newWallet: ConnectedWallet = {
          id: Date.now().toString(),
          ...wallet
        };
        const newAssets = generateMockAssets(newWallet.id);
        set((state) => ({
          dashboardWallets: [...state.dashboardWallets, newWallet],
          dashboardAssets: [...state.dashboardAssets, ...newAssets]
        }));
      },
      removeDashboardWallet: (walletId) => {
        set((state) => ({
          dashboardWallets: state.dashboardWallets.filter(w => w.id !== walletId),
          dashboardAssets: state.dashboardAssets.filter(a => a.walletId !== walletId)
        }));
      },
    }),
    {
      name: 'stablecoin-invest-storage',
    }
  )
);
