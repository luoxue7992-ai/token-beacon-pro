import { useAppStore } from "@/store/useAppStore";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { User, Bell, Settings, Globe } from "lucide-react";

export const Header = () => {
  const { institutionInfo } = useAppStore();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="font-display text-lg font-semibold">
          {t('welcome')}
        </h2>
        {institutionInfo && (
          <span className="chip-success">
            {institutionInfo.companyName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={toggleLanguage}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{language === 'zh' ? 'EN' : '中文'}</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button variant="glass" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          <span>{institutionInfo?.companyName || t('account')}</span>
        </Button>
      </div>
    </header>
  );
};
