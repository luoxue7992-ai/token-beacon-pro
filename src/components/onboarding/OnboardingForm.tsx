import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, DollarSign, TrendingUp, Clock, Wallet, ArrowRight } from "lucide-react";
import { InstitutionInfo } from "@/types";

const investmentAmounts = [
  "$100,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000 - $5,000,000",
  "$5,000,000 - $10,000,000",
  "$10,000,000+",
];

const expectedYields = [
  "3-5%",
  "5-8%",
  "8-12%",
  "12%+",
];

const investmentPeriods = [
  "1-3个月",
  "3-6个月",
  "6-12个月",
  "12个月以上",
];

const walletPlatforms = [
  "MetaMask",
  "Fireblocks",
  "Coinbase Custody",
  "BitGo",
  "Anchorage",
  "其他托管平台",
];

export const OnboardingForm = () => {
  const { setOnboarded } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InstitutionInfo>>({
    hasOwnWallet: false,
  });

  const handleSubmit = () => {
    if (formData.companyName && formData.expectedInvestment && formData.expectedYield && formData.investmentPeriod) {
      setOnboarded(formData as InstitutionInfo);
    }
  };

  const updateField = (field: keyof InstitutionInfo, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) return !!formData.companyName;
    if (step === 2) return !!formData.expectedInvestment && !!formData.expectedYield;
    if (step === 3) return !!formData.investmentPeriod;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="glass-card p-8 animate-scale-in">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">欢迎来到 StableFi</h1>
                <p className="text-muted-foreground">让我们了解您的机构信息</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">公司主体名称</Label>
                  <Input
                    id="company"
                    placeholder="请输入公司全称"
                    value={formData.companyName || ""}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Investment Expectations */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">投资预期</h1>
                <p className="text-muted-foreground">帮助我们为您匹配最合适的产品</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>预期投资金额</Label>
                  <Select
                    value={formData.expectedInvestment}
                    onValueChange={(v) => updateField("expectedInvestment", v)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="选择投资金额范围" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentAmounts.map((amount) => (
                        <SelectItem key={amount} value={amount}>
                          {amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>预期年化收益</Label>
                  <Select
                    value={formData.expectedYield}
                    onValueChange={(v) => updateField("expectedYield", v)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="选择预期收益范围" />
                    </SelectTrigger>
                    <SelectContent>
                      {expectedYields.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Investment Period */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">投资周期</h1>
                <p className="text-muted-foreground">选择您的预期投资时间</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>预期投资周期</Label>
                  <Select
                    value={formData.investmentPeriod}
                    onValueChange={(v) => updateField("investmentPeriod", v)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="选择投资周期" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentPeriods.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Wallet Info */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">钱包信息</h1>
                <p className="text-muted-foreground">告诉我们您的钱包托管情况</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">是否拥有自有钱包？</p>
                    <p className="text-sm text-muted-foreground">机构托管钱包或自管钱包</p>
                  </div>
                  <Switch
                    checked={formData.hasOwnWallet}
                    onCheckedChange={(v) => updateField("hasOwnWallet", v)}
                  />
                </div>

                {formData.hasOwnWallet && (
                  <div className="space-y-2 animate-fade-in">
                    <Label>钱包托管平台</Label>
                    <Select
                      value={formData.walletPlatform}
                      onValueChange={(v) => updateField("walletPlatform", v)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="选择托管平台" />
                      </SelectTrigger>
                      <SelectContent>
                        {walletPlatforms.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                上一步
              </Button>
            )}
            {step < 4 ? (
              <Button
                className="flex-1"
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
              >
                下一步
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handleSubmit}
              >
                开始探索
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
