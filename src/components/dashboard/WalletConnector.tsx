import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, QrCode, Plus, ArrowRight, 
  Monitor, Building2, CheckCircle, X, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface WalletEntry {
  id: string;
  address: string;
  type: 'decentralized' | 'exchange';
  name: string;
  status: 'pending' | 'authorized';
  chain?: string;
  platform?: string;
}

interface WalletConnectorProps {
  onConnect: (wallet: { address: string; type: 'decentralized' | 'exchange'; name: string; chain?: string; platform?: string }) => void;
}

type WalletType = 'decentralized' | 'exchange';

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', nameZh: '以太坊' },
  { id: 'bsc', name: 'BNB Chain', nameZh: 'BNB链' },
  { id: 'polygon', name: 'Polygon', nameZh: 'Polygon' },
  { id: 'arbitrum', name: 'Arbitrum', nameZh: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism', nameZh: 'Optimism' },
  { id: 'avalanche', name: 'Avalanche', nameZh: 'Avalanche' },
  { id: 'solana', name: 'Solana', nameZh: 'Solana' },
];

const WALLET_PLATFORMS = [
  { id: 'metamask', name: 'MetaMask', nameZh: 'MetaMask' },
  { id: 'trustwallet', name: 'Trust Wallet', nameZh: 'Trust钱包' },
  { id: 'ledger', name: 'Ledger', nameZh: 'Ledger硬件钱包' },
  { id: 'trezor', name: 'Trezor', nameZh: 'Trezor硬件钱包' },
  { id: 'phantom', name: 'Phantom', nameZh: 'Phantom' },
  { id: 'coinbase', name: 'Coinbase Wallet', nameZh: 'Coinbase钱包' },
  { id: 'okx', name: 'OKX Wallet', nameZh: 'OKX钱包' },
  { id: 'other', name: 'Other', nameZh: '其他' },
];

export const WalletConnector = ({ onConnect }: WalletConnectorProps) => {
  const { t, language } = useLanguage();
  const [walletEntries, setWalletEntries] = useState<WalletEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<WalletType | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [authorizingId, setAuthorizingId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddDecentralized = () => {
    if (!walletAddress || !selectedChain || !selectedPlatform) return;
    
    const chainName = CHAINS.find(c => c.id === selectedChain)?.[language === 'zh' ? 'nameZh' : 'name'] || selectedChain;
    const platformName = WALLET_PLATFORMS.find(p => p.id === selectedPlatform)?.[language === 'zh' ? 'nameZh' : 'name'] || selectedPlatform;
    
    const newEntry: WalletEntry = {
      id: generateId(),
      address: walletAddress,
      type: 'decentralized',
      name: walletName || `${platformName} ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      status: 'authorized',
      chain: selectedChain,
      platform: selectedPlatform
    };
    
    setWalletEntries(prev => [...prev, newEntry]);
    setWalletAddress("");
    setWalletName("");
    setSelectedChain("");
    setSelectedPlatform("");
    setSelectedType(null);
    setShowAddForm(false);
  };

  const handleAddExchange = () => {
    const newEntry: WalletEntry = {
      id: generateId(),
      address: '',
      type: 'exchange',
      name: walletName || 'BNB Exchange Wallet',
      status: 'pending'
    };
    
    setWalletEntries(prev => [...prev, newEntry]);
    setWalletName("");
    setSelectedType(null);
    setShowAddForm(false);
  };

  const handleAuthorizeExchange = (entryId: string) => {
    setAuthorizingId(entryId);
    setShowQR(true);
    
    // Simulate authorization
    setTimeout(() => {
      setWalletEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, address: `0xBNB...${generateId().slice(0, 4)}`, status: 'authorized' as const }
          : entry
      ));
      setShowQR(false);
      setAuthorizingId(null);
    }, 3000);
  };

  const handleRemoveEntry = (id: string) => {
    setWalletEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleConfirmAll = () => {
    const authorizedWallets = walletEntries.filter(e => e.status === 'authorized');
    authorizedWallets.forEach(wallet => {
      onConnect({
        address: wallet.address,
        type: wallet.type,
        name: wallet.name,
        chain: wallet.chain,
        platform: wallet.platform
      });
    });
  };

  const authorizedCount = walletEntries.filter(e => e.status === 'authorized').length;
  const pendingCount = walletEntries.filter(e => e.status === 'pending').length;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="text-center">
        <h2 className="font-display font-bold text-xl mb-2">
          {language === 'zh' ? '添加钱包' : 'Add Wallets'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === 'zh' ? '支持同时添加多个钱包' : 'Add multiple wallets at once'}
        </p>
      </div>

      {/* Wallet Entries List */}
      {walletEntries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {language === 'zh' ? '待添加钱包列表' : 'Wallets to Add'} ({walletEntries.length})
          </h3>
          <div className="space-y-2">
            {walletEntries.map((entry) => (
              <div 
                key={entry.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  entry.status === 'authorized' 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    entry.type === 'decentralized' 
                      ? "bg-gradient-to-br from-orange-500 to-orange-600"
                      : "bg-gradient-to-br from-yellow-500 to-yellow-600"
                  )}>
                    {entry.type === 'decentralized' 
                      ? <Monitor className="w-5 h-5 text-white" />
                      : <Building2 className="w-5 h-5 text-white" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.type === 'decentralized' 
                        ? (language === 'zh' ? '去中心化钱包' : 'Decentralized')
                        : (language === 'zh' ? '交易所托管' : 'Exchange')
                      }
                      {entry.chain && ` · ${CHAINS.find(c => c.id === entry.chain)?.[language === 'zh' ? 'nameZh' : 'name']}`}
                      {entry.platform && ` · ${WALLET_PLATFORMS.find(p => p.id === entry.platform)?.[language === 'zh' ? 'nameZh' : 'name']}`}
                      {entry.address && ` · ${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.status === 'authorized' ? (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <CheckCircle className="w-4 h-4" />
                      {language === 'zh' ? '已就绪' : 'Ready'}
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAuthorizeExchange(entry.id)}
                      disabled={authorizingId === entry.id}
                    >
                      {authorizingId === entry.id 
                        ? (language === 'zh' ? '授权中...' : 'Authorizing...')
                        : (language === 'zh' ? '扫码授权' : 'Authorize')
                      }
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal for Exchange Authorization */}
      {showQR && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-sm mx-4 text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-foreground/20" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'zh' 
                ? '请使用 BNB 交易所 App 扫描二维码完成授权' 
                : 'Scan QR code with BNB Exchange App to authorize'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {language === 'zh' ? '等待授权中...' : 'Waiting for authorization...'}
            </div>
          </div>
        </div>
      )}

      {/* Add Wallet Form */}
      {showAddForm ? (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {language === 'zh' ? '选择钱包类型' : 'Select Wallet Type'}
            </h3>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => { setShowAddForm(false); setSelectedType(null); }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Wallet Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedType('decentralized')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                selectedType === 'decentralized'
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-sm">
                  {language === 'zh' ? '去中心化钱包' : 'Decentralized'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'zh' ? '输入地址观察' : 'Enter address'}
              </p>
            </button>

            <button
              onClick={() => setSelectedType('exchange')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                selectedType === 'exchange'
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-sm">
                  {language === 'zh' ? '交易所托管' : 'Exchange'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'zh' ? '扫码授权连接' : 'QR authorization'}
              </p>
            </button>
          </div>

          {/* Decentralized Wallet Input */}
          {selectedType === 'decentralized' && (
            <div className="space-y-3 animate-fade-in pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {language === 'zh' ? '选择链' : 'Select Chain'}
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">{language === 'zh' ? '请选择链' : 'Select a chain'}</option>
                  {CHAINS.map(chain => (
                    <option key={chain.id} value={chain.id}>
                      {language === 'zh' ? chain.nameZh : chain.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {language === 'zh' ? '钱包平台' : 'Wallet Platform'}
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">{language === 'zh' ? '请选择钱包平台' : 'Select a platform'}</option>
                  {WALLET_PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {language === 'zh' ? platform.nameZh : platform.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {language === 'zh' ? '钱包名称（可选）' : 'Wallet Name (optional)'}
                </label>
                <Input
                  placeholder={language === 'zh' ? '例如：主钱包' : 'e.g., Main Wallet'}
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {language === 'zh' ? '钱包地址' : 'Wallet Address'}
                </label>
                <Input
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
              <Button 
                className="w-full gap-2" 
                onClick={handleAddDecentralized}
                disabled={!walletAddress || !selectedChain || !selectedPlatform}
              >
                <Plus className="w-4 h-4" />
                {language === 'zh' ? '添加到列表' : 'Add to List'}
              </Button>
            </div>
          )}

          {/* Exchange Wallet Input */}
          {selectedType === 'exchange' && (
            <div className="space-y-3 animate-fade-in pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {language === 'zh' ? '钱包名称（可选）' : 'Wallet Name (optional)'}
                </label>
                <Input
                  placeholder={language === 'zh' ? '例如：BNB 交易账户' : 'e.g., BNB Trading Account'}
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
              <Button 
                className="w-full gap-2" 
                onClick={handleAddExchange}
              >
                <Plus className="w-4 h-4" />
                {language === 'zh' ? '添加到列表' : 'Add to List'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {language === 'zh' 
                  ? '添加后需要扫码完成授权' 
                  : 'QR authorization required after adding'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4" />
          {language === 'zh' ? '添加钱包' : 'Add Wallet'}
        </Button>
      )}

      {/* Confirm All Button */}
      {walletEntries.length > 0 && (
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'zh' ? '已就绪' : 'Ready'}: {authorizedCount} | {language === 'zh' ? '待授权' : 'Pending'}: {pendingCount}
            </span>
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={handleConfirmAll}
            disabled={authorizedCount === 0}
          >
            <CheckCircle className="w-4 h-4" />
            {language === 'zh' 
              ? `确认添加 ${authorizedCount} 个钱包` 
              : `Confirm ${authorizedCount} Wallet${authorizedCount > 1 ? 's' : ''}`
            }
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
