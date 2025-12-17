import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, Link, Loader2, PieChart, TrendingUp, 
  DollarSign, RefreshCw, AlertCircle
} from "lucide-react";
import { WalletAsset } from "@/types";

// Mock wallet data
const mockWalletAssets: WalletAsset[] = [
  { token: "USDY", balance: 150000, value: 156345, apy: 5.25, chain: "Ethereum" },
  { token: "sDAI", balance: 80000, value: 85208, apy: 6.12, chain: "Ethereum" },
  { token: "USDC", balance: 250000, value: 250000, apy: 4.52, chain: "Polygon" },
  { token: "USDe", balance: 45000, value: 45000, apy: 12.45, chain: "Ethereum" },
];

export const AssetDashboard = () => {
  const { connectedWallet, setConnectedWallet } = useAppStore();
  const [walletInput, setWalletInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState<WalletAsset[] | null>(null);

  const handleConnect = async () => {
    if (!walletInput) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setConnectedWallet(walletInput);
    setAssets(mockWalletAssets);
    setIsLoading(false);
  };

  const totalValue = assets?.reduce((acc, a) => acc + a.value, 0) || 0;
  const weightedApy = assets
    ? assets.reduce((acc, a) => acc + (a.apy * a.value) / totalValue, 0)
    : 0;

  if (!connectedWallet) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">资产看板</h1>
          <p className="text-muted-foreground">
            连接钱包查看您的稳定币资产组合
          </p>
        </div>

        <div className="glass-card p-12 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">连接您的钱包</h2>
          <p className="text-muted-foreground mb-8">
            输入您的钱包地址，我们将自动分析您的稳定币持仓情况
          </p>

          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              placeholder="输入钱包地址 (0x...)"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              className="h-12"
            />
            <Button
              onClick={handleConnect}
              disabled={!walletInput || isLoading}
              className="h-12 px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>我们仅读取公开链上数据，不会请求签名权限</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">资产看板</h1>
          <p className="text-muted-foreground">
            钱包: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setConnectedWallet(null);
            setAssets(null);
          }}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          重新连接
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">总资产价值</span>
          </div>
          <p className="font-display text-3xl font-bold">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">综合年化</span>
          </div>
          <p className="font-display text-3xl font-bold text-primary">
            {weightedApy.toFixed(2)}%
          </p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <PieChart className="w-4 h-4" />
            <span className="text-sm">持仓数量</span>
          </div>
          <p className="font-display text-3xl font-bold">
            {assets?.length || 0}
          </p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">预估月收益</span>
          </div>
          <p className="font-display text-3xl font-bold text-secondary">
            ${((totalValue * weightedApy) / 100 / 12).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">资产分布</h2>
          <div className="aspect-square max-w-xs mx-auto relative">
            {/* Simple pie chart visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {assets?.reduce((acc, asset, index) => {
                const percentage = (asset.value / totalValue) * 100;
                const prevPercentage = acc.prevPercentage;
                const colors = [
                  "hsl(160, 84%, 39%)", // primary
                  "hsl(45, 93%, 58%)",  // secondary
                  "hsl(199, 89%, 48%)", // info
                  "hsl(280, 60%, 50%)", // purple
                ];
                
                acc.elements.push(
                  <circle
                    key={asset.token}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={colors[index % colors.length]}
                    strokeWidth="20"
                    strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                    strokeDashoffset={-prevPercentage * 2.51}
                  />
                );
                acc.prevPercentage += percentage;
                return acc;
              }, { elements: [] as JSX.Element[], prevPercentage: 0 }).elements}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">总价值</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {assets?.map((asset, index) => {
              const colors = ["bg-primary", "bg-secondary", "bg-info", "bg-purple-500"];
              return (
                <div key={asset.token} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-sm">{asset.token}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset List */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">持仓明细</h2>
          <div className="space-y-3">
            {assets?.map((asset) => (
              <div
                key={asset.token}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-xs">{asset.token}</span>
                  </div>
                  <div>
                    <p className="font-medium">{asset.token}</p>
                    <p className="text-sm text-muted-foreground">{asset.chain}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">
                    ${asset.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary">{asset.apy}% APY</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
