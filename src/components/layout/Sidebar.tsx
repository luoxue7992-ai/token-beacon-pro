import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useLanguage } from "@/hooks/useLanguage";
import { Wallet, Database, ChevronLeft, ChevronRight } from "lucide-react";
import credaLogo from "@/assets/creda-logo.svg";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useAppStore();
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', labelKey: 'productLibrary' as const, icon: Database },
    { id: 'dashboard', labelKey: 'assetDashboard' as const, icon: Wallet },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-40 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className={cn(
          "flex items-center",
          sidebarCollapsed ? "justify-center" : "gap-2.5"
        )}>
          <img 
            src={credaLogo} 
            alt="Creda X" 
            className={cn(
              "flex-shrink-0 transition-all duration-300",
              sidebarCollapsed ? "h-8 w-8" : "h-9 w-auto"
            )} 
          />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h1 className="font-display font-bold text-base bg-gradient-to-r from-[#585BFF] to-[#1CDEEA] bg-clip-text text-transparent">
                {t('stablecoinInvest')}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight truncate">
                {t('professionalPlatform')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as typeof currentPage)}
              title={sidebarCollapsed ? t(item.labelKey) : undefined}
              className={cn(
                "w-full flex items-center rounded-lg transition-all duration-200",
                sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{t(item.labelKey)}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground",
            sidebarCollapsed ? "px-2" : "px-4"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">收起侧栏</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};