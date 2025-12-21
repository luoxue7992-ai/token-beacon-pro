import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, Plus } from "lucide-react";
import { AssetCategory, ManualAssetInput } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";

interface ManualWalletFormProps {
  onSubmit: (name: string, address: string, asset: ManualAssetInput) => void;
  isLoading?: boolean;
}

const ASSET_OPTIONS = [
  { value: 'USDY', label: 'USDY', category: 'tokenised_mmf' as AssetCategory },
  { value: 'BUIDL', label: 'BUIDL', category: 'tokenised_mmf' as AssetCategory },
  { value: 'PAXG', label: 'PAXG', category: 'tokenised_gold' as AssetCategory },
  { value: 'XAUT', label: 'XAUT', category: 'tokenised_gold' as AssetCategory },
  { value: 'ETH', label: 'ETH', category: 'crypto' as AssetCategory },
  { value: 'BTC', label: 'BTC', category: 'crypto' as AssetCategory },
  { value: 'USDC', label: 'USDC', category: 'stablecoin' as AssetCategory },
  { value: 'USDT', label: 'USDT', category: 'stablecoin' as AssetCategory },
];

export const ManualWalletForm = ({ onSubmit, isLoading }: ManualWalletFormProps) => {
  const { language } = useLanguage();
  
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState(() => {
    // Generate a random wallet address
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  });
  const [selectedAsset, setSelectedAsset] = useState("");
  const [purchaseTime, setPurchaseTime] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = () => {
    if (!walletName || !walletAddress || !selectedAsset || !purchaseTime || !purchasePrice || !quantity) {
      return;
    }

    const assetOption = ASSET_OPTIONS.find(a => a.value === selectedAsset);
    if (!assetOption) return;

    const asset: ManualAssetInput = {
      token: selectedAsset,
      purchaseTime,
      purchasePrice: parseFloat(purchasePrice),
      quantity: parseFloat(quantity),
      category: assetOption.category,
    };

    onSubmit(walletName, walletAddress, asset);
  };

  const isFormValid = walletName && walletAddress && selectedAsset && purchaseTime && purchasePrice && quantity;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">
            {language === 'zh' ? '手动添加钱包' : 'Manual Wallet Entry'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'zh' ? '输入您的钱包和资产信息' : 'Enter your wallet and asset information'}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Wallet Name */}
        <div className="space-y-2">
          <Label htmlFor="walletName">
            {language === 'zh' ? '钱包名称' : 'Wallet Name'}
          </Label>
          <Input
            id="walletName"
            placeholder={language === 'zh' ? '例如: 我的主钱包' : 'e.g., My Main Wallet'}
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            maxLength={50}
          />
        </div>

        {/* Wallet Address */}
        <div className="space-y-2">
          <Label htmlFor="walletAddress">
            {language === 'zh' ? '钱包地址' : 'Wallet Address'}
          </Label>
          <Input
            id="walletAddress"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="font-mono text-sm"
            maxLength={100}
          />
        </div>

        {/* Asset Selection */}
        <div className="space-y-2">
          <Label>
            {language === 'zh' ? '购买资产' : 'Purchased Asset'}
          </Label>
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'zh' ? '选择资产' : 'Select asset'} />
            </SelectTrigger>
            <SelectContent>
              {ASSET_OPTIONS.map((asset) => (
                <SelectItem key={asset.value} value={asset.value}>
                  {asset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purchase Time */}
        <div className="space-y-2">
          <Label htmlFor="purchaseTime">
            {language === 'zh' ? '购买时间' : 'Purchase Time'}
          </Label>
          <Input
            id="purchaseTime"
            type="date"
            value={purchaseTime}
            onChange={(e) => setPurchaseTime(e.target.value)}
          />
        </div>

        {/* Purchase Price */}
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">
            {language === 'zh' ? '购买价格 (USD)' : 'Purchase Price (USD)'}
          </Label>
          <Input
            id="purchasePrice"
            type="number"
            placeholder="0.00"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">
            {language === 'zh' ? '购买数量' : 'Purchase Quantity'}
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            step="0.0001"
          />
        </div>

        {/* Summary */}
        {selectedAsset && purchasePrice && quantity && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'zh' ? '购买总价' : 'Total Purchase Value'}
            </p>
            <p className="font-display font-bold text-xl">
              ${(parseFloat(purchasePrice) * parseFloat(quantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!isFormValid || isLoading}
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            {language === 'zh' ? '添加中...' : 'Adding...'}
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            {language === 'zh' ? '添加钱包' : 'Add Wallet'}
          </>
        )}
      </Button>
    </div>
  );
};
