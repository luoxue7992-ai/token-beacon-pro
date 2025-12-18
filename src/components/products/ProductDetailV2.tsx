import { useState } from "react";
import { StablecoinProduct } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { AccountOpeningFlow } from "./AccountOpeningFlow";
import { 
  ArrowLeft, Star, ExternalLink, Globe, Shield, 
  Clock, DollarSign, Users, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface ProductDetailV2Props {
  product: StablecoinProduct;
  onBack: () => void;
}

export const ProductDetailV2 = ({ product, onBack }: ProductDetailV2Props) => {
  const { toggleFavorite, isFavorite } = useAppStore();
  const { t } = useLanguage();
  const favorite = isFavorite(product.id);
  const [showAccountFlow, setShowAccountFlow] = useState(false);

  if (showAccountFlow) {
    return <AccountOpeningFlow product={product} onBack={() => setShowAccountFlow(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('backToList')}
        </Button>
        <Button
          variant={favorite ? "secondary" : "outline"}
          onClick={() => toggleFavorite(product.id)}
          className="gap-2"
        >
          <Star className={cn("w-4 h-4", favorite && "fill-current")} />
          {favorite ? "已收藏" : "收藏产品"}
        </Button>
      </div>

      {/* Product Header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
            <span className="font-display font-bold text-xl">{product.tokenName}</span>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex flex-wrap gap-2">
              {product.chains.map((chain) => (
                <span key={chain} className="chip bg-muted text-muted-foreground">
                  {chain}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats - 总体情况 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="stat-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />{t('marketCap')}
            </span>
            <span className="font-display font-bold text-lg">{product.totalMarketCap}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />{t('tokenValue')}
            </span>
            <span className="font-display font-bold text-lg">{product.tokenValue}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />{t('holders')}
            </span>
            <span className="font-display font-bold text-lg">{product.holders?.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />{t('sevenDayApy')}
            </span>
            <span className="font-display font-bold text-lg text-primary">{product.apy7d}%</span>
          </div>
          <div className="stat-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />{t('managementFee')}
            </span>
            <span className="font-display font-bold text-lg">{product.managementFee}%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 是否合格投资者 */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t('investorQualification')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('regionalRestrictions')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.regionRestrictions && product.regionRestrictions.length > 0 ? (
                  product.regionRestrictions.map((region) => (
                    <span key={region} className="chip bg-destructive/10 text-destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      {region}
                    </span>
                  ))
                ) : (
                  <span className="chip-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    无地区限制
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('companyRequirements')}</h3>
              <ul className="space-y-2">
                {product.companyRequirements?.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-secondary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 申购 & 赎回情况 */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('subscriptionRedemption')}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">支持方式:</span>
              <div className="flex gap-2">
                {product.supportsFiat && (
                  <span className="chip-success">{t('fiatSupport')}</span>
                )}
                {product.supportsStablecoin && (
                  <span className="chip-success">{t('stablecoinSupport')}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="text-sm font-medium mb-3 text-primary">申购</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subscriptionThreshold')}</span>
                    <span>{product.minSubscription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subscriptionTime')}</span>
                    <span>{product.subscriptionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subscriptionFee')}</span>
                    <span>{product.subscriptionFee}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="text-sm font-medium mb-3 text-secondary">赎回</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('redemptionThreshold')}</span>
                    <span>{product.minRedemption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('redemptionTime')}</span>
                    <span>{product.redemptionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('redemptionFee')}</span>
                    <span>{product.redemptionFee}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 申购平台介绍 & 所有费用 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Platform */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            {t('platformInfo')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('platformName')}</span>
              <span className="font-medium">{product.platformName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('platformRegion')}</span>
              <span className="font-medium">{product.platformRegion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('officialWebsite')}</span>
              <a 
                href={product.platformWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {t('visitWebsite')} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* All Fees */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            {t('feeBreakdown')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('managementFee')}</span>
              <span className="font-display font-bold">{product.managementFee}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('revenueShare')}</span>
              <span className="font-display font-bold">{product.revenueShare}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('subscriptionFee')}</span>
              <span className="font-display font-bold">{product.subscriptionFee}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('redemptionFee')}</span>
              <span className="font-display font-bold">{product.redemptionFee}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-6 gradient-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg mb-1">准备开户？</h3>
            <p className="text-muted-foreground text-sm">完成资格确认，一键联系官方顾问</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.open(product.platformWebsite, '_blank')}>
              <Globe className="w-4 h-4" />
              访问官网
            </Button>
            <Button className="gap-2" onClick={() => setShowAccountFlow(true)}>
              {t('applyAccount')}
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
