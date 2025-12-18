import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, ArrowRight } from "lucide-react";
import { InstitutionInfo } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";

const investmentAmounts = ["$100,000 - $500,000", "$500,000 - $1,000,000", "$1,000,000 - $5,000,000", "$5,000,000 - $10,000,000", "$10,000,000+"];
const expectedYields = ["3-5%", "5-8%", "8-12%", "12%+"];
const investmentPeriods = ["1-3个月", "3-6个月", "6-12个月", "12个月以上"];
const investmentPeriodsEn = ["1-3 months", "3-6 months", "6-12 months", "12+ months"];
const walletPlatforms = ["MetaMask", "Fireblocks", "Coinbase Custody", "BitGo", "Anchorage", "其他托管平台"];

export const OnboardingForm = () => {
  const { setOnboarded } = useAppStore();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<InstitutionInfo>>({
    hasOwnWallet: false
  });

  const handleSubmit = () => {
    if (formData.companyName && formData.expectedInvestment && formData.expectedYield && formData.investmentPeriod) {
      setOnboarded(formData as InstitutionInfo);
    }
  };

  const updateField = (field: keyof InstitutionInfo, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canSubmit = !!(
    formData.companyName && 
    formData.expectedInvestment && 
    formData.expectedYield && 
    formData.investmentPeriod
  );

  const periods = language === 'zh' ? investmentPeriods : investmentPeriodsEn;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="glass-card p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">{t('onboardingWelcome')}</h1>
            <p className="text-muted-foreground">{t('onboardingSubtitle')}</p>
          </div>

          <div className="space-y-5">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company">{t('companyName')}</Label>
              <Input 
                id="company" 
                placeholder={t('companyNamePlaceholder')}
                value={formData.companyName || ""} 
                onChange={e => updateField("companyName", e.target.value)} 
                className="h-12" 
              />
            </div>

            {/* Expected Investment */}
            <div className="space-y-2">
              <Label>{t('expectedAmount')}</Label>
              <Select value={formData.expectedInvestment} onValueChange={v => updateField("expectedInvestment", v)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('selectAmount')} />
                </SelectTrigger>
                <SelectContent>
                  {investmentAmounts.map(amount => (
                    <SelectItem key={amount} value={amount}>{amount}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expected Yield */}
            <div className="space-y-2">
              <Label>{t('expectedYield')}</Label>
              <Select value={formData.expectedYield} onValueChange={v => updateField("expectedYield", v)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('selectYield')} />
                </SelectTrigger>
                <SelectContent>
                  {expectedYields.map(yield_ => (
                    <SelectItem key={yield_} value={yield_}>{yield_}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Investment Period */}
            <div className="space-y-2">
              <Label>{t('investmentPeriod')}</Label>
              <Select value={formData.investmentPeriod} onValueChange={v => updateField("investmentPeriod", v)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Has Own Wallet */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div>
                <Label className="text-base">{t('hasWallet')}</Label>
                <p className="text-sm text-muted-foreground">{t('walletDescription')}</p>
              </div>
              <Switch 
                checked={formData.hasOwnWallet || false} 
                onCheckedChange={v => updateField("hasOwnWallet", v)} 
              />
            </div>

            {/* Wallet Platform - only show if has wallet */}
            {formData.hasOwnWallet && (
              <div className="space-y-2 animate-fade-in">
                <Label>{t('walletPlatform')}</Label>
                <Select value={formData.walletPlatform} onValueChange={v => updateField("walletPlatform", v)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('selectPlatform')} />
                  </SelectTrigger>
                  <SelectContent>
                    {walletPlatforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              className="w-full h-12 mt-4" 
              onClick={handleSubmit} 
              disabled={!canSubmit}
            >
              {t('startExploring')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
