export interface InstitutionInfo {
  companyName: string;
  expectedInvestment: string;
  expectedYield: string;
  investmentPeriod: string;
  hasOwnWallet: boolean;
  walletPlatform: string;
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
  regionRestrictions?: string[];
  companyRequirements?: string[];
  // Subscription & Redemption
  supportsFiat?: boolean;
  supportsStablecoin?: boolean;
  minSubscription?: string;
  subscriptionTime?: string;
  minRedemption?: string;
  redemptionTime?: string;
  // Platform
  platformName?: string;
  platformRegion?: string;
  platformWebsite?: string;
}

export interface WalletAsset {
  token: string;
  balance: number;
  value: number;
  apy: number;
  chain: string;
}
