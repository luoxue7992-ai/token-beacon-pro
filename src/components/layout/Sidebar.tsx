import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useLanguage } from "@/hooks/useLanguage";
import { Wallet, Database } from "lucide-react";
import credaLogo from "@/assets/creda-logo.svg";

export const Sidebar = () => {
  const { currentPage, setCurrentPage, language } = useAppStore();
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', labelKey: 'productLibrary' as const, icon: Database },
    { id: 'dashboard', labelKey: 'assetDashboard' as const, icon: Wallet },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <img src={credaLogo} alt="Creda X" className="h-9 w-auto flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-base bg-gradient-to-r from-[#585BFF] to-[#1CDEEA] bg-clip-text text-transparent">
              {t('stablecoinInvest')}
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight truncate">
              {t('professionalPlatform')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as typeof currentPage)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
