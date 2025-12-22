import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnector } from "./WalletConnector";
import { ManualWalletForm } from "./ManualWalletForm";
import { MarketValueTrendChart } from "./MarketValueTrendChart";
import { 
  Wallet, Plus, TrendingUp, PieChart, 
  DollarSign, Eye, Trash2, RefreshCw, Coins, ChevronRight, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/store/useAppStore";
import { AssetCategory, ManualAssetInput } from "@/types";

const CATEGORY_INFO: Record<AssetCategory, { name: string; nameZh: string; color: string }> = {
  crypto: { name: 'Cryptocurrency', nameZh: '加密货币', color: '#f59e0b' },
  tokenised_mmf: { name: 'Tokenised MMF', nameZh: '代币化货币基金', color: '#3b82f6' },
  tokenised_gold: { name: 'Tokenised Gold', nameZh: '代币化黄金', color: '#eab308' },
  stablecoin: { name: 'Stablecoin', nameZh: '稳定币', color: '#10b981' },
};

export const AssetDashboardV2 = () => {
  const { t } = useLanguage();
  const { 
    dashboardWallets: wallets, 
    dashboardAssets: assets, 
    addDashboardWallet, 
    addManualWallet,
    removeDashboardWallet 
  } = useAppStore();
  
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [addWalletMode, setAddWalletMode] = useState<'connect' | 'manual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const handleConnectWallet = (wallet: { address: string; type: 'decentralized' | 'exchange'; name: string; chains?: string[]; platform?: string }) => {
    setIsLoading(true);
    setTimeout(() => {
      addDashboardWallet(wallet);
      setShowAddWallet(false);
      setAddWalletMode(null);
      setIsLoading(false);
    }, 1500);
  };

  const handleManualWallet = (name: string, address: string, asset: ManualAssetInput) => {
    setIsLoading(true);
    setTimeout(() => {
      addManualWallet(name, address, asset);
      setShowAddWallet(false);
      setAddWalletMode(null);
      setIsLoading(false);
    }, 1500);
  };

  const handleRemoveWallet = (walletId: string) => {
    removeDashboardWallet(walletId);
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
            <p className="text-muted-foreground">
              {addWalletMode === 'manual' ? '手动输入钱包和资产信息' : '选择添加方式'}
            </p>
          </div>
          <Button variant="outline" onClick={() => { setShowAddWallet(false); setAddWalletMode(null); }}>
            取消
          </Button>
        </div>

        {/* Mode Selection */}
        {!addWalletMode && (
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setAddWalletMode('connect')}
              className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                连接钱包
              </h3>
              <p className="text-sm text-muted-foreground">
                连接去中心化钱包或交易所账户，自动同步资产数据
              </p>
            </button>

            <button
              onClick={() => setAddWalletMode('manual')}
              className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                手动添加
              </h3>
              <p className="text-sm text-muted-foreground">
                手动输入钱包地址和购买的资产信息
              </p>
            </button>
          </div>
        )}

        {/* Connect Wallet Mode */}
        {addWalletMode === 'connect' && (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => setAddWalletMode(null)}
              className="gap-2 text-muted-foreground"
            >
              ← 返回选择
            </Button>
            <WalletConnector onConnect={handleConnectWallet} />
          </div>
        )}

        {/* Manual Wallet Mode */}
        {addWalletMode === 'manual' && (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => setAddWalletMode(null)}
              className="gap-2 text-muted-foreground"
            >
              ← 返回选择
            </Button>
            <ManualWalletForm onSubmit={handleManualWallet} isLoading={isLoading} />
          </div>
        )}
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

            {/* Wallet Distribution Pie Chart */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                组合钱包
              </h2>

              <div className="flex items-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      let offset = 0;
                      const walletValues = wallets.map(wallet => ({
                        wallet,
                        value: assets.filter(a => a.walletId === wallet.id).reduce((sum, a) => sum + a.value, 0)
                      }));
                      const total = walletValues.reduce((sum, w) => sum + w.value, 0);
                      if (total === 0) return null;
                      
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
                      
                      return walletValues.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const dashArray = `${percentage} ${100 - percentage}`;
                        const currentOffset = offset;
                        offset += percentage;
                        return (
                          <circle
                            key={item.wallet.id}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-currentOffset}
                            className="transition-all duration-500 cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedWalletId(item.wallet.id)}
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {(() => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
                    return wallets.map((wallet, index) => {
                      const walletValue = assets.filter(a => a.walletId === wallet.id).reduce((sum, a) => sum + a.value, 0);
                      return (
                        <div 
                          key={wallet.id} 
                          className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                          onClick={() => setSelectedWalletId(wallet.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="truncate max-w-[100px]">{wallet.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold">
                              ${walletValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveWallet(wallet.id);
                              }}
                              className="p-0 h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Market Value Trend Chart */}
          <MarketValueTrendChart assets={filteredAssets} />

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
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">数量</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">价格</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">市值</th>
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

          {/* Market Value Trend Chart */}
          <MarketValueTrendChart assets={filteredAssets} />

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
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">数量</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">价格</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">市值</th>
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
