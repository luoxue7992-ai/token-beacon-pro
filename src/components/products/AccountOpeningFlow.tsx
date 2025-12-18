import { useState } from "react";
import { StablecoinProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, ArrowRight, CheckCircle, AlertCircle, 
  FileText, Building, Shield, ExternalLink, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface AccountOpeningFlowProps {
  product: StablecoinProduct;
  onBack: () => void;
}

const STEPS = [
  { id: 1, title: '确认公司限制', icon: Building },
  { id: 2, title: '投资者资格', icon: Shield },
  { id: 3, title: '所需材料', icon: FileText },
  { id: 4, title: '提交申请', icon: CheckCircle },
];

const REQUIRED_DOCUMENTS = [
  { id: 'license', name: '营业执照/公司注册证书', desc: '需要经认证的副本' },
  { id: 'legal_rep', name: '法人代表身份证明', desc: '护照或身份证复印件' },
  { id: 'articles', name: '公司章程', desc: '最新版本' },
  { id: 'financial', name: '财务报表', desc: '近两年经审计报表' },
  { id: 'investor_cert', name: '合格投资者证明', desc: '银行或机构出具' },
  { id: 'aml', name: 'AML/KYC文件', desc: '反洗钱合规文件' },
  { id: 'board', name: '董事会决议', desc: '授权投资决议' },
  { id: 'ubo', name: '实际受益人声明', desc: 'UBO声明文件' },
];

export const AccountOpeningFlow = ({ product, onBack }: AccountOpeningFlowProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmedCompany, setConfirmedCompany] = useState(false);
  const [confirmedInvestor, setConfirmedInvestor] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  const handleDocCheck = (docId: string) => {
    setCheckedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return confirmedCompany;
      case 2: return confirmedInvestor;
      case 3: return checkedDocs.length >= 4;
      default: return true;
    }
  };

  const handleFeishuClick = () => {
    // Open Feishu/Lark group
    window.open('https://www.feishu.cn/invitation/page/add_contact', '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回产品详情
        </Button>
      </div>

      {/* Progress */}
      <div className="glass-card p-6">
        <h2 className="font-display font-bold text-xl mb-6">
          {product.name} - 开户申请
        </h2>
        
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    currentStep > step.id 
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id 
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-lg">确认公司主体是否有限制</h3>
              
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  地区限制
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.regionRestrictions && product.regionRestrictions.length > 0 ? (
                    product.regionRestrictions.map((region) => (
                      <span key={region} className="chip bg-destructive/20 text-destructive">
                        {region}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">无地区限制</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">公司资质要求</h4>
                <ul className="space-y-2">
                  {product.companyRequirements?.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-secondary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <Checkbox 
                  id="confirm-company" 
                  checked={confirmedCompany}
                  onCheckedChange={(checked) => setConfirmedCompany(checked as boolean)}
                />
                <label htmlFor="confirm-company" className="text-sm cursor-pointer">
                  我确认我的公司主体不在限制地区范围内，且满足上述资质要求
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-lg">确定是否为合格投资者</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3 text-primary">机构投资者标准</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      净资产不低于1000万美元的机构
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      持牌金融机构（银行、基金、保险等）
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      政府机构或养老基金
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3 text-secondary">专业投资者标准</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      金融资产不低于500万美元
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      具有相关投资经验和风险识别能力
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      近三年年均收入不低于50万美元
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <p className="text-sm text-info">
                  <strong>注意：</strong>具体合格投资者标准可能因产品和地区而异，最终以平台方要求为准。
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <Checkbox 
                  id="confirm-investor" 
                  checked={confirmedInvestor}
                  onCheckedChange={(checked) => setConfirmedInvestor(checked as boolean)}
                />
                <label htmlFor="confirm-investor" className="text-sm cursor-pointer">
                  我确认我的机构符合合格投资者标准，愿意承担相应投资风险
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-lg">需要提交的资料清单</h3>
              <p className="text-muted-foreground text-sm">请确认您已准备好以下材料（至少勾选4项）</p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <div 
                    key={doc.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all cursor-pointer",
                      checkedDocs.includes(doc.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/30 hover:border-muted-foreground"
                    )}
                    onClick={() => handleDocCheck(doc.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={checkedDocs.includes(doc.id)}
                        onCheckedChange={() => handleDocCheck(doc.id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  已选择 <span className="text-primary font-bold">{checkedDocs.length}</span> / 8 项材料
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              
              <div>
                <h3 className="font-display font-semibold text-xl mb-2">准备就绪！</h3>
                <p className="text-muted-foreground">
                  您已完成开户前的准备工作，请点击下方按钮联系我们的专属顾问完成开户
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(product.platformWebsite, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  访问官方平台
                </Button>
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleFeishuClick}
                >
                  <MessageCircle className="w-4 h-4" />
                  飞书一键拉群
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                点击「飞书一键拉群」将为您创建专属服务群，我们的顾问将在群内协助您完成后续开户流程
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
            <Button 
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              disabled={!canProceed()}
            >
              下一步
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
