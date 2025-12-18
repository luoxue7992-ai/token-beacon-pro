import { useState } from "react";
import { StablecoinProduct, BilingualText } from "@/types";
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

export const AccountOpeningFlow = ({ product, onBack }: AccountOpeningFlowProps) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmedCompany, setConfirmedCompany] = useState(false);
  const [confirmedInvestor, setConfirmedInvestor] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  const getText = (bilingual: BilingualText | undefined): string => {
    if (!bilingual) return '';
    return language === 'zh' ? bilingual.zh : bilingual.en;
  };

  const STEPS = [
    { id: 1, title: t('confirmCompanyRestrictions'), icon: Building },
    { id: 2, title: t('investorQualificationCheck'), icon: Shield },
    { id: 3, title: t('requiredMaterials'), icon: FileText },
    { id: 4, title: t('submitApplication'), icon: CheckCircle },
  ];

  const REQUIRED_DOCUMENTS = [
    { id: 'license', name: t('docBusinessLicense'), desc: t('docBusinessLicenseDesc') },
    { id: 'legal_rep', name: t('docLegalRep'), desc: t('docLegalRepDesc') },
    { id: 'articles', name: t('docArticles'), desc: t('docArticlesDesc') },
    { id: 'financial', name: t('docFinancial'), desc: t('docFinancialDesc') },
    { id: 'investor_cert', name: t('docInvestorCert'), desc: t('docInvestorCertDesc') },
    { id: 'aml', name: t('docAml'), desc: t('docAmlDesc') },
    { id: 'board', name: t('docBoard'), desc: t('docBoardDesc') },
    { id: 'ubo', name: t('docUbo'), desc: t('docUboDesc') },
  ];

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
    window.open('https://www.feishu.cn/invitation/page/add_contact', '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('backToDetail')}
        </Button>
      </div>

      {/* Progress */}
      <div className="glass-card p-6">
        <h2 className="font-display font-bold text-xl mb-6">
          {product.name} - {t('accountApplication')}
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
              <h3 className="font-display font-semibold text-lg">{t('confirmCompanyTitle')}</h3>
              
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {t('regionRestrictionsTitle')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.regionRestrictions && product.regionRestrictions.length > 0 ? (
                    product.regionRestrictions.map((region, index) => (
                      <span key={index} className="chip bg-destructive/20 text-destructive">
                        {getText(region)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">{t('noRegionRestrictions')}</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">{t('companyRequirementsTitle')}</h4>
                <ul className="space-y-2">
                  {product.companyRequirements?.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-secondary" />
                      {getText(req)}
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
                  {t('confirmCompanyStatement')}
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-lg">{t('confirmInvestorTitle')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3 text-primary">{t('institutionalInvestorStandard')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      {t('institutionalReq1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      {t('institutionalReq2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      {t('institutionalReq3')}
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3 text-secondary">{t('professionalInvestorStandard')}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      {t('professionalReq1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      {t('professionalReq2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      {t('professionalReq3')}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <p className="text-sm text-info">
                  <strong>{language === 'zh' ? '注意：' : 'Note: '}</strong>{t('investorNote')}
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <Checkbox 
                  id="confirm-investor" 
                  checked={confirmedInvestor}
                  onCheckedChange={(checked) => setConfirmedInvestor(checked as boolean)}
                />
                <label htmlFor="confirm-investor" className="text-sm cursor-pointer">
                  {t('confirmInvestorStatement')}
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-lg">{t('requiredDocumentsTitle')}</h3>
              <p className="text-muted-foreground text-sm">{t('selectMinDocuments')}</p>
              
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
                  {t('selectedDocuments')} <span className="text-primary font-bold">{checkedDocs.length}</span> / 8 {t('documentsOf')}
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
                <h3 className="font-display font-semibold text-xl mb-2">{t('readyTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('readyDescription')}
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
                  {t('visitPlatform')}
                </Button>
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleFeishuClick}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('feishuGroup')}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                {t('feishuNote')}
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
              {t('previousStep')}
            </Button>
            <Button 
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              disabled={!canProceed()}
            >
              {t('nextStep')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
