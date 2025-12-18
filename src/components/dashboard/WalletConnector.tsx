import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, QrCode, Plus, ArrowRight, 
  Monitor, Building2, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface WalletConnectorProps {
  onConnect: (wallet: { address: string; type: 'metamask' | 'bnb'; name: string }) => void;
}

type WalletType = 'metamask' | 'bnb';

export const WalletConnector = ({ onConnect }: WalletConnectorProps) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<WalletType | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleConnect = () => {
    if (selectedType === 'metamask' && walletAddress) {
      onConnect({
        address: walletAddress,
        type: 'metamask',
        name: walletName || `MetaMask ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      });
    }
  };

  const handleBnbAuth = () => {
    // Simulate BNB exchange authorization
    setShowQR(true);
    setTimeout(() => {
      onConnect({
        address: '0xBNB...Exchange',
        type: 'bnb',
        name: walletName || 'BNB Exchange Wallet'
      });
      setShowQR(false);
    }, 3000);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="text-center">
        <h2 className="font-display font-bold text-xl mb-2">添加钱包</h2>
        <p className="text-muted-foreground text-sm">选择钱包类型并连接您的资产</p>
      </div>

      {/* Wallet Type Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => { setSelectedType('metamask'); setShowQR(false); }}
          className={cn(
            "p-6 rounded-xl border-2 transition-all text-left",
            selectedType === 'metamask'
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">去中心化钱包</h3>
              <p className="text-xs text-muted-foreground">MetaMask 等</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            直接输入钱包地址，以观察模式查看资产
          </p>
        </button>

        <button
          onClick={() => { setSelectedType('bnb'); setShowQR(false); }}
          className={cn(
            "p-6 rounded-xl border-2 transition-all text-left",
            selectedType === 'bnb'
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">交易所托管钱包</h3>
              <p className="text-xs text-muted-foreground">BNB Exchange</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            扫码授权，安全连接您的交易所账户
          </p>
        </button>
      </div>

      {/* MetaMask Input */}
      {selectedType === 'metamask' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium mb-2 block">钱包名称（可选）</label>
            <Input
              placeholder="例如：主钱包"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">钱包地址</label>
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={handleConnect}
            disabled={!walletAddress}
          >
            <Wallet className="w-4 h-4" />
            连接钱包
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* BNB QR Code */}
      {selectedType === 'bnb' && !showQR && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium mb-2 block">钱包名称（可选）</label>
            <Input
              placeholder="例如：BNB 交易账户"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={handleBnbAuth}
          >
            <QrCode className="w-4 h-4" />
            生成授权二维码
          </Button>
        </div>
      )}

      {showQR && (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
              <QrCode className="w-24 h-24 text-foreground/20" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            请使用 BNB 交易所 App 扫描二维码完成授权
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            等待授权中...
          </div>
        </div>
      )}
    </div>
  );
};
