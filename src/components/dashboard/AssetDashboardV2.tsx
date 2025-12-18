import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnector } from "./WalletConnector";
import { 
  Wallet, Plus, TrendingUp, PieChart, 
  DollarSign, BarChart3, Eye, Trash2, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface ConnectedWallet {
  id: string;
  address: string;
  type: 'metamask' | 'bnb';
  name: string;
}

interface Asset {
  token: string;
  balance: number;
  value: number;
  apy: number;
  chain: string;
  walletId: string;
}

// Mock assets data
const generateMockAssets = (walletId: string): Asset[] => [
  { token: "USDY", balance: 125000, value: 130421.25, apy: 5.25, chain: "Ethereum", walletId },
  { token: "BUIDL", balance: 500000, value: 500000, apy: 4.89, chain: "Ethereum", walletId },
  { token: "sDAI", balance: 85000, value: 90535.35, apy: 6.12, chain: "Ethereum", walletId },
  { token: "USDe", balance: 200000, value: 200000, apy: 12.45, chain: "Ethereum", walletId },
];

export const AssetDashboardV2 = () => {
  const { t } = useLanguage();
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectWallet = (wallet: { address: string; type: 'metamask' | 'bnb'; name: string }) => {
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
  const weightedApy = filteredAssets.length > 0
    ? filteredAssets.reduce((sum, a) => sum + (a.apy * a.value), 0) / totalValue
    : 0;
  const estimatedMonthlyEarnings = totalValue * (weightedApy / 100) / 12;

  // Asset distribution for pie chart
  const assetDistribution = filteredAssets.reduce((acc, asset) => {
    acc[asset.token] = (acc[asset.token] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

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
          <p className="text-muted-foreground">
            {wallets.length} 个钱包已连接
          </p>
        </div>
        <Button onClick={() => setShowAddWallet(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          添加钱包
        </Button>
      </div>

      {/* Wallet Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedWalletId === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedWalletId(null)}
          className="gap-2 whitespace-nowrap"
        >
          <Eye className="w-4 h-4" />
          Overview
        </Button>
        {wallets.map(wallet => (
          <div key={wallet.id} className="flex items-center gap-1">
            <Button
              variant={selectedWalletId === wallet.id ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedWalletId(wallet.id)}
              className="gap-2 whitespace-nowrap"
            >
              <Wallet className="w-4 h-4" />
              {wallet.name}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveWallet(wallet.id)}
              className="px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="w-3 h-3" />总资产估值
          </span>
          <span className="font-display font-bold text-2xl">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />综合年化收益率
          </span>
          <span className="font-display font-bold text-2xl text-primary">
            {weightedApy.toFixed(2)}%
          </span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />持仓数量
          </span>
          <span className="font-display font-bold text-2xl">{filteredAssets.length}</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />预估月收益
          </span>
          <span className="font-display font-bold text-2xl text-primary">
            ${estimatedMonthlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            资产分布
          </h2>

          <div className="flex items-center gap-8">
            {/* Simple Pie Chart */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  let offset = 0;
                  const total = Object.values(assetDistribution).reduce((a, b) => a + b, 0);
                  return Object.entries(assetDistribution).map(([token, value], index) => {
                    const percentage = (value / total) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const currentOffset = offset;
                    offset += percentage;
                    return (
                      <circle
                        key={token}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={colors[index % colors.length]}
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
              {Object.entries(assetDistribution).map(([token, value], index) => (
                <div key={token} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span>{token}</span>
                  </div>
                  <span className="font-display font-semibold">
                    ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Details */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            收益明细
          </h2>

          <div className="space-y-4">
            {filteredAssets.map((asset, index) => {
              const dailyEarning = asset.value * (asset.apy / 100) / 365;
              return (
                <div 
                  key={`${asset.token}-${asset.walletId}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    >
                      {asset.token.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{asset.token}</p>
                      <p className="text-xs text-muted-foreground">{asset.chain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-semibold text-primary">{asset.apy}% APY</p>
                    <p className="text-xs text-muted-foreground">
                      ~${dailyEarning.toFixed(2)}/天
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold">持仓详情</h2>
          <Button variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">代币</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">链</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">数量</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">价值</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">年化</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAssets.map((asset, index) => (
                <tr key={`${asset.token}-${asset.walletId}-${index}`} className="data-table-row">
                  <td className="px-4 py-4">
                    <span className="font-medium">{asset.token}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="chip bg-info/10 text-info text-xs">{asset.chain}</span>
                  </td>
                  <td className="px-4 py-4 text-right font-display">
                    {asset.balance.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right font-display font-semibold">
                    ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-display font-bold text-primary">{asset.apy}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
