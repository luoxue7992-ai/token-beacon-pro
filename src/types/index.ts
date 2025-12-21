export interface InstitutionInfo {
  companyName: string;
  expectedInvestment: string;
  expectedYield: string;
  investmentPeriod: string;
  hasOwnWallet: boolean;
  walletPlatform: string;
}

export interface BilingualText {
  zh: string;
  en: string;
}

export interface StablecoinProduct {
  id: string;
  name: string;
  tokenName: string;
  platforms: string[];
  chains: string[];
  apy7d: number;
  managementFee: number;
  subscriptionFee: number;
  redemptionFee: number;
  revenueShare: number;
  isFavorite?: boolean;
  // Detail info
  totalMarketCap?: string;
  tokenValue?: string;
  holders?: number;
  // Eligibility
  regionRestrictions?: BilingualText[];
  companyRequirements?: BilingualText[];
  // Subscription & Redemption
  supportsFiat?: boolean;
  supportsStablecoin?: boolean;
  minSubscription?: BilingualText;
  subscriptionTime?: BilingualText;
  minRedemption?: BilingualText;
  redemptionTime?: BilingualText;
  // Platform
  platformName?: string;
  platformRegion?: BilingualText;
  platformWebsite?: string;
}

export interface WalletAsset {
  token: string;
  balance: number;
  value: number;
  apy: number;
  chain: string;
}

// Dashboard types
export interface ConnectedWallet {
  id: string;
  address: string;
  type: 'decentralized' | 'exchange' | 'manual';
  name: string;
  chains?: string[];
  platform?: string;
}

export type AssetCategory = 'crypto' | 'tokenised_mmf' | 'tokenised_gold' | 'stablecoin';

export interface DashboardAsset {
  token: string;
  balance: number;
  value: number;
  price: number;
  apy7d: number;
  profit: number;
  chain: string;
  walletId: string;
  category: AssetCategory;
  purchaseTime?: string;
  purchasePrice?: number;
}

export interface ManualAssetInput {
  token: string;
  purchaseTime: string;
  purchasePrice: number;
  quantity: number;
  category: AssetCategory;
}
