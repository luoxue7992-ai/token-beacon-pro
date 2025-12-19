import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnector } from "./WalletConnector";
import { 
  Wallet, Plus, TrendingUp, PieChart, 
  DollarSign, Eye, Trash2, RefreshCw, Coins, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface ConnectedWallet {
  id: string;
  address: string;
  type: 'decentralized' | 'exchange';
  name: string;
  chains?: string[];
  platform?: string;
}

// 资产类别
type AssetCategory = 'crypto' | 'tokenised_mmf' | 'tokenised_gold' | 'stablecoin';

interface Asset {
  token: string;
  balance: number;
  value: number;
  price: number;
  apy7d: number; // 7日年化
  profit: number; // 持仓收益
  chain: string;
  walletId: string;
  category: AssetCategory;
}

const CATEGORY_INFO: Record<AssetCategory, { name: string; nameZh: string; color: string }> = {
  crypto: { name: 'Cryptocurrency', nameZh: '加密货币', color: '#f59e0b' },
  tokenised_mmf: { name: 'Tokenised MMF', nameZh: '代币化货币基金', color: '#3b82f6' },
  tokenised_gold: { name: 'Tokenised Gold', nameZh: '代币化黄金', color: '#eab308' },
  stablecoin: { name: 'Stablecoin', nameZh: '稳定币', color: '#10b981' },
};

// Mock assets data with categories
const generateMockAssets = (walletId: string): Asset[] => [
  { token: "USDY", balance: 125000, value: 130421.25, price: 1.0434, apy7d: 5.25, profit: 5421.25, chain: "Ethereum", walletId, category: 'tokenised_mmf' },
  { token: "BUIDL", balance: 500000, value: 500000, price: 1.0, apy7d: 4.89, profit: 12450.00, chain: "Ethereum", walletId, category: 'tokenised_mmf' },
  { token: "PAXG", balance: 15.5, value: 40235.50, price: 2596.16, apy7d: 0, profit: 2235.50, chain: "Ethereum", walletId, category: 'tokenised_gold' },
  { token: "XAUT", balance: 8.2, value: 21288.40, price: 2596.15, apy7d: 0, profit: 1288.40, chain: "Ethereum", walletId, category: 'tokenised_gold' },
  { token: "ETH", balance: 25.8, value: 96750.00, price: 3750.00, apy7d: 3.2, profit: 8750.00, chain: "Ethereum", walletId, category: 'crypto' },
  { token: "BTC", balance: 1.25, value: 131250.00, price: 105000.00, apy7d: 0, profit: 21250.00, chain: "Bitcoin", walletId, category: 'crypto' },
  { token: "USDC", balance: 85000, value: 85000, price: 1.0, apy7d: 0, profit: 0, chain: "Ethereum", walletId, category: 'stablecoin' },
  { token: "USDT", balance: 50000, value: 50000, price: 1.0, apy7d: 0, profit: 0, chain: "BSC", walletId, category: 'stablecoin' },
];

export const AssetDashboardV2 = () => {
  const { t } = useLanguage();
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const handleConnectWallet = (wallet: { address: string; type: 'decentralized' | 'exchange'; name: string; chains?: string[]; platform?: string }) => {
    setIsLoading(true);
    setTimeout(() => {
      const newWallet: ConnectedWallet = {
        id: Date.now().toString(),
        ...wallet
      };
      setWallets(prev => [...prev, newWallet]);
      setAssets(prev => [...prev, ...generateMockAssets(newWallet.id)]);
      setShowAddWallet(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleRemoveWallet = (walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
    setAssets(prev => prev.filter(a => a.walletId !== walletId));
    if (selectedWalletId === walletId) {
      setSelectedWalletId(null);
    }
  };

  const filteredAssets = selectedWalletId 
    ? assets.filter(a => a.walletId === selectedWalletId)
    : assets;

  const totalValue = filteredAssets.reduce((sum, a) => sum + a.value, 0);
  const totalProfit = filteredAssets.reduce((sum, a) => sum + a.profit, 0);
  const weighted7dApy = filteredAssets.length > 0 && totalValue > 0
    ? filteredAssets.reduce((sum, a) => sum + (a.apy7d * a.value), 0) / totalValue
    : 0;

  // Asset distribution by category
  const categoryDistribution = filteredAssets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.value;
    return acc;
  }, {} as Record<AssetCategory, number>);

  const selectedWallet = selectedWalletId ? wallets.find(w => w.id === selectedWalletId) : null;

  if (wallets.length === 0 && !showAddWallet) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">{t('dashboardTitle')}</h1>
          <p className="text-muted-foreground">{t('dashboardSubtitle')}</p>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-semibold text-xl mb-2">开始管理您的资产</h2>
          <p className="text-muted-foreground mb-6">
            连接您的钱包，实时查看资产分布和收益情况
          </p>
          <Button onClick={() => setShowAddWallet(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            添加钱包
          </Button>
        </div>
      </div>
    );
  }

  if (showAddWallet) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">添加钱包</h1>
            <p className="text-muted-foreground">选择钱包类型并完成连接</p>
          </div>
          <Button variant="outline" onClick={() => setShowAddWallet(false)}>
            取消
          </Button>
        </div>

        <WalletConnector onConnect={handleConnectWallet} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">{t('dashboardTitle')}</h1>
          <p className="text-muted-foreground">{wallets.length} 个钱包已连接</p>
        </div>
        <div className="flex gap-2">
          {selectedWallet && (
            <Button 
              variant="outline" 
              onClick={() => handleRemoveWallet(selectedWalletId!)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              删除钱包
            </Button>
          )}
          <Button onClick={() => setShowAddWallet(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            添加钱包
          </Button>
        </div>
      </div>

      {/* View Tabs: Overview + Individual Wallets */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        <Button
          variant={selectedWalletId === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedWalletId(null)}
          className="gap-2 whitespace-nowrap"
        >
          <Eye className="w-4 h-4" />
          Overview
        </Button>
        {wallets.map(wallet => (
          <Button
            key={wallet.id}
            variant={selectedWalletId === wallet.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedWalletId(wallet.id)}
            className="gap-2 whitespace-nowrap"
          >
            <Wallet className="w-4 h-4" />
            {wallet.name}
          </Button>
        ))}
      </div>

      {/* Overview View - When no wallet is selected */}
      {!selectedWalletId && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3" />总资产
              </span>
              <span className="font-display font-bold text-2xl">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />7日年化
              </span>
              <span className="font-display font-bold text-2xl text-primary">
                {weighted7dApy.toFixed(2)}%
              </span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Coins className="w-3 h-3" />持仓数量
              </span>
              <span className="font-display font-bold text-2xl">{filteredAssets.length}</span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />持仓收益
              </span>
              <span className={cn(
                "font-display font-bold text-2xl",
                totalProfit >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Asset Distribution by Category */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                资产分布
              </h2>

              <div className="flex items-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      let offset = 0;
                      const total = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);
                      if (total === 0) return null;
                      return (Object.entries(categoryDistribution) as [AssetCategory, number][]).map(([category, value]) => {
                        const percentage = (value / total) * 100;
                        const dashArray = `${percentage} ${100 - percentage}`;
                        const currentOffset = offset;
                        offset += percentage;
                        return (
                          <circle
                            key={category}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={CATEGORY_INFO[category].color}
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-currentOffset}
                            className="transition-all duration-500"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {(Object.entries(categoryDistribution) as [AssetCategory, number][]).map(([category, value]) => (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CATEGORY_INFO[category].color }}
                        />
                        <span>{CATEGORY_INFO[category].nameZh}</span>
                      </div>
                      <span className="font-display font-semibold">
                        ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connected Wallets - Clickable */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                组合钱包
              </h2>

              <div className="space-y-3">
                {wallets.map(wallet => {
                  const walletAssets = assets.filter(a => a.walletId === wallet.id);
                  const walletValue = walletAssets.reduce((sum, a) => sum + a.value, 0);
                  return (
                    <div 
                      key={wallet.id}
                      onClick={() => setSelectedWalletId(wallet.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{wallet.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold">
                          ${walletValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Holdings Details with Category Tabs */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold">持仓详情</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新
              </Button>
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
              <Button
                variant={selectedCategory === 'all' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                全部
              </Button>
              {(Object.keys(CATEGORY_INFO) as AssetCategory[]).map(cat => {
                const count = filteredAssets.filter(a => a.category === cat).length;
                if (count === 0) return null;
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="gap-2 whitespace-nowrap"
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CATEGORY_INFO[cat].color }}
                    />
                    {CATEGORY_INFO[cat].nameZh}
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </Button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">代币名称</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">仓位</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">价格</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">账户余额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAssets
                    .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                    .map((asset, index) => (
                    <tr key={`${asset.token}-${asset.walletId}-${index}`} className="data-table-row">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: CATEGORY_INFO[asset.category].color }}
                          >
                            {asset.token.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{asset.token}</p>
                            <p className="text-xs text-muted-foreground">{CATEGORY_INFO[asset.category].nameZh}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-display">
                        {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-4 py-4 text-right font-display">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 text-right font-display font-semibold">
                        ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Individual Wallet View */}
      {selectedWalletId && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3" />总资产
              </span>
              <span className="font-display font-bold text-2xl">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />7日年化
              </span>
              <span className="font-display font-bold text-2xl text-primary">
                {weighted7dApy.toFixed(2)}%
              </span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Coins className="w-3 h-3" />持仓数量
              </span>
              <span className="font-display font-bold text-2xl">{filteredAssets.length}</span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />持仓收益
              </span>
              <span className={cn(
                "font-display font-bold text-2xl",
                totalProfit >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Asset Distribution by Category */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                资产分布
              </h2>

              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      let offset = 0;
                      const total = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);
                      if (total === 0) return null;
                      return (Object.entries(categoryDistribution) as [AssetCategory, number][]).map(([category, value]) => {
                        const percentage = (value / total) * 100;
                        const dashArray = `${percentage} ${100 - percentage}`;
                        const currentOffset = offset;
                        offset += percentage;
                        return (
                          <circle
                            key={category}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={CATEGORY_INFO[category].color}
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-currentOffset}
                            className="transition-all duration-500"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>

                <div className="flex-1 space-y-2">
                  {(Object.entries(categoryDistribution) as [AssetCategory, number][]).map(([category, value]) => (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CATEGORY_INFO[category].color }}
                        />
                        <span>{CATEGORY_INFO[category].nameZh}</span>
                      </div>
                      <span className="font-display font-semibold">
                        ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Earnings by Asset */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                收益明细
              </h2>

              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {filteredAssets.filter(a => a.profit !== 0 || a.apy7d > 0).map((asset, index) => (
                  <div 
                    key={`${asset.token}-${asset.walletId}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: CATEGORY_INFO[asset.category].color }}
                      >
                        {asset.token.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.token}</p>
                        <p className="text-xs text-muted-foreground">{asset.chain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-display font-semibold",
                        asset.profit >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {asset.profit >= 0 ? '+' : ''}${asset.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      {asset.apy7d > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {asset.apy7d}% APY
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holdings Table with Category Tabs */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold">持仓详情</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新
              </Button>
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
              <Button
                variant={selectedCategory === 'all' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                全部
              </Button>
              {(Object.keys(CATEGORY_INFO) as AssetCategory[]).map(cat => {
                const count = filteredAssets.filter(a => a.category === cat).length;
                if (count === 0) return null;
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="gap-2 whitespace-nowrap"
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CATEGORY_INFO[cat].color }}
                    />
                    {CATEGORY_INFO[cat].nameZh}
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </Button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">代币名称</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">仓位</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">价格</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">账户余额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAssets
                    .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                    .map((asset, index) => (
                    <tr key={`${asset.token}-${asset.walletId}-${index}`} className="data-table-row">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: CATEGORY_INFO[asset.category].color }}
                          >
                            {asset.token.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{asset.token}</p>
                            <p className="text-xs text-muted-foreground">{CATEGORY_INFO[asset.category].nameZh}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-display">
                        {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-4 py-4 text-right font-display">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 text-right font-display font-semibold">
                        ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
